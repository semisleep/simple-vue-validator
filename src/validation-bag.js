'use strict';

var Promise = require('es6-promise').Promise;

var utils = require('./utils');

function ValidationBag() {
  this.sessionId = 0; // async validator will check this before adding error
  this.resetting = 0; // do not allow to add error while reset is in progress
  this.errors = [];
  this.validatingRecords = [];
  this.passedRecords = [];
  this.touchedRecords = [];
}

ValidationBag.prototype._setVM = function(vm) {
  this._vm = vm;
};

ValidationBag.prototype.addError = function (field, message) {
  if (this.resetting) {
    return;
  }
  this.errors.push({field: field, message: message});
};

ValidationBag.prototype.removeErrors = function (field) {
  if (utils.isUndefined(field)) {
    this.errors = [];
  } else {
    this.errors = this.errors.filter(function (e) {
      return e.field !== field;
    });
  }
};

ValidationBag.prototype.hasError = function (field) {
  return utils.isUndefined(field) ? !!this.errors.length : !!this.firstError(field);
};

ValidationBag.prototype.firstError = function (field) {
  for (var i = 0; i < this.errors.length; i++) {
    if (utils.isUndefined(field) || this.errors[i].field === field) {
      return this.errors[i].message;
    }
  }
  return null;
};

ValidationBag.prototype.allErrors = function (field) {
  return this.errors
    .filter(function (e) {
      return utils.isUndefined(field) || e.field === field;
    })
    .map(function (e) {
      return e.message;
    });
};

ValidationBag.prototype.countErrors = function (field) {
  return utils.isUndefined(field) ? this.errors.length : this.errors.filter(function (e) {
    return field === e.field;
  }).length;
};

ValidationBag.prototype.setValidating = function (field, id) {
  if (this.resetting) {
    return;
  }
  id = id || ValidationBag.newValidatingId();
  var existingValidatingRecords = this.validatingRecords.filter(function (validating) {
    return validating.field === field && validating.id === id;
  });
  if (!utils.isEmpty(existingValidatingRecords)) {
    throw new Error('Validating id already set: ' + id);
  }
  this.validatingRecords.push({field: field, id: id});
  return id;
};

ValidationBag.prototype.resetValidating = function (field, id) {
  if (!field) {
    this.validatingRecords = [];
    return;
  }

  function idMatched(validating) {
    return utils.isUndefined(id) ? true : (validating.id === id);
  }

  var hasMore = true;
  while (hasMore) {
    var index = -1;
    for (var i = 0; i < this.validatingRecords.length; i++) {
      if (this.validatingRecords[i].field === field && idMatched(this.validatingRecords[i])) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      this.validatingRecords.splice(index, 1);
    } else {
      hasMore = false;
    }
  }
};

ValidationBag.prototype.isValidating = function (field, id) {
  function idMatched(validating) {
    return utils.isUndefined(id) ? true : (validating.id === id);
  }

  var existingValidatingRecords = this.validatingRecords.filter(function (validating) {
    return (utils.isUndefined(field) || validating.field === field) && idMatched(validating);
  });
  return !utils.isEmpty(existingValidatingRecords);
};

ValidationBag.prototype.setPassed = function (field) {
  if (this.resetting) {
    return;
  }
  setValue(this.passedRecords, field);
};

ValidationBag.prototype.resetPassed = function (field) {
  resetValue(this.passedRecords, field);
};

ValidationBag.prototype.isPassed = function (field) {
  return isValueSet(this.passedRecords, field);
};

ValidationBag.prototype.setTouched = function (field) {
  if (this.resetting) {
    return;
  }
  setValue(this.touchedRecords, field);
};

ValidationBag.prototype.resetTouched = function (field) {
  resetValue(this.touchedRecords, field);
};

ValidationBag.prototype.isTouched = function (field) {
  return isValueSet(this.touchedRecords, field);
};

function setValue(records, field) {
  var existingRecords = records.filter(function (record) {
    return record.field === field;
  });
  if (!utils.isEmpty(existingRecords)) {
    existingRecords[0].value = true;
  } else {
    records.push({field: field, value: true});
  }
}

function resetValue(records, field) {
  if (!field) {
    records.splice(0, records.length);
    return;
  }
  var existingRecords = records.filter(function (record) {
    return record.field === field;
  });
  if (!utils.isEmpty(existingRecords)) {
    existingRecords[0].value = false;
  }
}

function isValueSet(records, field) {
  var existingRecords = records.filter(function (record) {
    return record.field === field;
  });
  return !utils.isEmpty(existingRecords) && existingRecords[0].value;
}

ValidationBag.prototype.reset = function () {
  this.sessionId++;
  this.errors = [];
  this.validatingRecords = [];
  this.passedRecords = [];
  this.touchedRecords = [];
  if (this._vm) {
    // prevent field updates at the same tick to change validation status
    this.resetting++;
    this._vm.$nextTick(function() {
      this.resetting--;
    }.bind(this));
  }
};

// returns true if any error is added
ValidationBag.prototype.setError = function (field, message) {
  if (this.resetting) {
    return;
  }
  this.removeErrors(field);
  this.resetPassed(field);

  var messages = utils.isArray(message) ? message : [message];
  var addMessages = function (messages) {
    var hasError = false;
    messages.forEach(function (message) {
      if (message) {
        this.addError(field, message);
        hasError = true;
      }
    }, this);
    if (!hasError) {
      this.setPassed(field);
    }
    return hasError;
  }.bind(this);

  var hasPromise = messages.filter(function (message) {
      return message && message.then;
    }).length > 0;
  if (!hasPromise) {
    return Promise.resolve(addMessages(messages));
  } else {
    // if message is promise, we are encountering async validation, set validating flag and wait for message to resolve
    // reset previous validating status for this field
    this.resetValidating(field);
    var validatingId = this.setValidating(field);
    var always = function() {
      //console.log(validatingId + ' | ' + 'end');
      this.resetValidating(field, validatingId);
    }.bind(this);
    //console.log(validatingId + ' | ' + 'start');
    return Promise.all(messages)
      .then(function (messages) {
        // check if the validating id is is still valid
        if (this.isValidating(field, validatingId)) {
          //console.log(validatingId + ' | ' + 'processed');
          return addMessages(messages);
        }
        return false;
      }.bind(this))
      .then(function(result) {
        always();
        return result;
      })
      .catch(function (e) {
        always();
        return Promise.reject(e);
      }.bind(this));
  }
};

ValidationBag.prototype.checkRule = function (rule) {
  if (this.resetting) {
    return;
  }
  return this.setError(rule._field, rule._messages);
};

var validatingId = 0;

ValidationBag.newValidatingId = function () {
  return (++validatingId).toString();
};

module.exports = ValidationBag;

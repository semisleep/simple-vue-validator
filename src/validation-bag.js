'use strict';

var _ = require('lodash');
var Promise = require('bluebird');

function ValidationBag() {
  this.errors = [];
  this.validatingRecords = [];
  this.passedRecords = [];
  this.touchedRecords = [];
}

ValidationBag.prototype.addError = function (field, message) {
  this.errors.push({field: field, message: message});
};

ValidationBag.prototype.removeErrors = function (field) {
  if (_.isUndefined(field)) {
    this.errors = [];
  } else {
    this.errors = this.errors.filter(function (e) {
      return e.field !== field;
    });
  }
};

ValidationBag.prototype.firstError = function (field) {
  for (var i = 0; i < this.errors.length; i++) {
    if (this.errors[i].field === field) {
      return this.errors[i].message;
    }
  }
  return null;
};

ValidationBag.prototype.allErrors = function (field) {
  return this.errors
    .filter(function (e) {
      return _.isUndefined(field) || e.field === field;
    })
    .map(function (e) {
      return e.message;
    });
};

ValidationBag.prototype.hasError = function (field) {
  return _.isUndefined(field) ? !!this.errors.length : !!this.firstError(field);
};


ValidationBag.prototype.countErrors = function (field) {
  return _.isUndefined(field) ? this.errors.length : this.errors.filter(function (e) {
    return field === e.field;
  }).length;
};

ValidationBag.prototype.setValidating = function (field, id) {
  id = id || ValidationBag.newValidatingId();
  var existingValidatingRecords = this.validatingRecords.filter(function (validating) {
    return validating.field === field && validating.id === id;
  });
  if (!_.isEmpty(existingValidatingRecords)) {
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
    return _.isUndefined(id) ? true : (validating.id === id);
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
    return _.isUndefined(id) ? true : (validating.id === id);
  }

  var existingValidatingRecords = this.validatingRecords.filter(function (validating) {
    return validating.field === field && idMatched(validating);
  });
  return !_.isEmpty(existingValidatingRecords);
};

ValidationBag.prototype.setPassed = function (field) {
  setValue(this.passedRecords, field);
};

ValidationBag.prototype.resetPassed = function (field) {
  resetValue(this.passedRecords, field);
};

ValidationBag.prototype.isPassed = function (field) {
  return isValueSet(this.passedRecords, field);
};

ValidationBag.prototype.setTouched = function (field) {
  setValue(this.touchedRecords, field);
};

ValidationBag.prototype.resetTouched = function (field) {
  resetValue(this.touchedRecords, field);
};

ValidationBag.prototype.isTouched = function (field) {
  return isValueSet(this.touchedRecords, field);
};

function setValue(records, field) {
  var existingRecords = records.filter(function (validated) {
    return validated.field === field;
  });
  if (!_.isEmpty(existingRecords)) {
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
  var existingRecords = records.filter(function (validated) {
    return validated.field === field;
  });
  if (!_.isEmpty(existingRecords)) {
    existingRecords[0].value = false;
  }
}

function isValueSet(records, field) {
  var existingRecords = records.filter(function (validated) {
    return validated.field === field;
  });
  return !_.isEmpty(existingRecords) && existingRecords[0].value;
}

ValidationBag.prototype.reset = function () {
  this.errors = [];
  this.validatingRecords = [];
  this.passedRecords = [];
  this.touchedRecords = [];
};

// returns true if any error is added
ValidationBag.prototype.setError = function (field, message) {
  this.removeErrors(field);
  this.resetPassed(field);

  var messages = _.isArray(message) ? message : [message];
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
    //console.log(validatingId + ' | ' + 'start');
    return Promise.all(messages)
      .bind(this)
      .then(function (messages) {
        // check if the validating id is is still valid
        if (this.isValidating(field, validatingId)) {
          //console.log(validatingId + ' | ' + 'processed');
          return addMessages(messages);
        }
        return false;
      })
      .finally(function () {
        //console.log(validatingId + ' | ' + 'end');
        this.resetValidating(field, validatingId);
      });
  }
};

ValidationBag.prototype.checkRule = function (rule) {
  return this.setError(rule._field, rule._messages);
};

var validatingId = 0;

ValidationBag.newValidatingId = function () {
  return (++validatingId).toString();
};

module.exports = ValidationBag;

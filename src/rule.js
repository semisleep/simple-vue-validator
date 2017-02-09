'use strict';

var utils = require('./utils');

function Rule() {
  this._field  = '';
  this._value = undefined;
  this._messages = [];
}

Rule.prototype.field = function (field) {
  this._field  = field;
  return this;
};

Rule.prototype.value = function (value) {
  this._value = value;
  return this;
};

Rule.prototype.custom = function (callback, context) {
  var message = context ? callback.call(context) : callback();
  if (message) {
    if (message.then) {
      message = Promise.resolve(message)
        .then(function (result) {
          return result;
        })
        .catch(function (e) {
          console.error(e.toString());
          return utils.templates.error;
        });
    }
    this._messages.push(message);
  }
  return this;
};

Rule.prototype._checkValue = function() {
  if (this._value === undefined) {
    throw new Error('Validator.value not set');
  }
  return this._value;
};

Rule.prototype.required = function () {
  var value = this._checkValue();
  if (utils.isEmpty(value)) {
    this._messages.push(utils.templates.required);
  }
  return this;
};

Rule.prototype.float = function () {
  var value = this._checkValue();
  if (!utils.isEmpty(value)) {
    var number = parseFloat(value);
    if (utils.isNaN(number)) {
      this._messages.push(utils.templates.mustBeFloat);
    }
  }
  return this;
};

Rule.prototype.integer = function () {
  var value = this._checkValue();
  if (!utils.isEmpty(value)) {
    var number = parseInt(value);
    if (utils.isNaN(number)) {
      this._messages.push(utils.templates.mustBeInteger);
    }
  }
  return this;
};

Rule.prototype.lessThan = function (bound) {
  var value = this._checkValue();
  if (!utils.isEmpty(value)) {
    var number = parseFloat(value);
    if (utils.isNaN(number)) {
      this._messages.push(utils.templates.mustBeNumber);
    } else if (number >= bound) {
      this._messages.push(utils.format(utils.templates.mustLessThan, bound));
    }
  }
  return this;
};

Rule.prototype.lessThanOrEqualTo = function (bound) {
  var value = this._checkValue();
  if (!utils.isEmpty(value)) {
    var number = parseFloat(value);
    if (utils.isNaN(number)) {
      this._messages.push(utils.templates.mustBeNumber);
    } else if (number > bound) {
      this._messages.push(utils.format(utils.templates.mustLessThanOrEqualTo, bound));
    }
  }
  return this;
};

Rule.prototype.greaterThan = function (bound) {
  var value = this._checkValue();
  if (!utils.isEmpty(value)) {
    var number = parseFloat(value);
    if (utils.isNaN(number)) {
      this._messages.push(utils.templates.mustBeNumber);
    } else if (number <= bound) {
      this._messages.push(utils.format(utils.templates.mustGreaterThan, bound));
    }
  }
  return this;
};

Rule.prototype.greaterThanOrEqualTo = function (bound) {
  var value = this._checkValue();
  if (!utils.isEmpty(value)) {
    var number = parseFloat(value);
    if (utils.isNaN(number)) {
      this._messages.push(utils.templates.mustBeNumber);
    } else if (number < bound) {
      this._messages.push(utils.format(utils.templates.mustGreaterThanOrEqualTo, bound));
    }
  }
  return this;
};

Rule.prototype.between = function (lowBound, highBound) {
  var value = this._checkValue();
  if (!utils.isEmpty(value)) {
    var number = parseFloat(value);
    if (utils.isNaN(number)) {
      this._messages.push(utils.templates.mustBeNumber);
    } else if (number < lowBound || number > highBound) {
      this._messages.push(utils.format(utils.templates.mustBetween, lowBound, highBound));
    }
  }
  return this;
};

Rule.prototype.size = function (size) {
  var value = this._checkValue();
  if (!utils.isEmpty(value)) {
    if (utils.isArray(value) && value.length != size) {
      this._messages.push(utils.format(utils.templates.sizeMustBe, size));
    }
  }
  return this;
};

Rule.prototype.length = function (length) {
  var value = this._checkValue();
  if (!utils.isEmpty(value)) {
    var string = String(value);
    if (string.length !== length) {
      this._messages.push(utils.format(utils.templates.lengthMustBe, length));
    }
  }
  return this;
};

Rule.prototype.minLength = function (length) {
  var value = this._checkValue();
  if (!utils.isEmpty(value)) {
    var string = String(value);
    if (string.length < length) {
      this._messages.push(utils.format(utils.templates.lengthAtLeast, length));
    }
  }
  return this;
};

Rule.prototype.maxLength = function (length) {
  var value = this._checkValue();
  if (!utils.isEmpty(value)) {
    var string = String(value);
    if (string.length > length) {
      this._messages.push(utils.format(utils.templates.lengthAtMost, length));
    }
  }
  return this;
};

Rule.prototype.lengthBetween = function (minLength, maxLength) {
  var value = this._checkValue();
  if (!utils.isEmpty(value)) {
    var string = String(value);
    if (string.length < minLength || string.length > maxLength) {
      this._messages.push(utils.format(utils.templates.lengthMustBetween, minLength, maxLength));
    }
  }
  return this;
};

Rule.prototype.in = function (options) {
  var value = this._checkValue();
  if (!utils.isEmpty(value)) {
    if (options.filter(function (option) {
        return option === value;
      }).length <= 0) {
      this._messages.push(utils.format(utils.templates.valueMustIn, utils.templates.optionCombiner(options)));
    }
  }
  return this;
};

Rule.prototype.notIn = function (options) {
  var value = this._checkValue();
  if (!utils.isEmpty(value)) {
    if (options.filter(function (option) {
        return option !== value;
      }).length <= 0) {
      this._messages.push(utils.format(utils.templates.valueMustNotIn, utils.templates.optionCombiner(options)));
    }
  }
  return this;
};

Rule.prototype.match = function (valueToCompare, message) {
  var value = this._checkValue();
  if (!utils.isEmpty(value)) {
    if (value !== valueToCompare) {
      this._messages.push(message || utils.templates.valueNotMatch);
    }
  }
  return this;
};

Rule.prototype.regex = function (regex, message) {
  var value = this._checkValue();
  if (!utils.isEmpty(value)) {
    if (utils.isString(regex)) {
      regex = new RegExp(regex);
    }
    if (!regex.test(value)) {
      this._messages.push(message || utils.templates.regexInvalid);
    }
  }
  return this;
};

Rule.prototype.digit = function () {
  return this.regex(/^\d*$/, utils.templates.digitInvalid);
};

Rule.prototype.email = function () {
  return this.regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, utils.templates.emailInvalid);
};

Rule.prototype.url = function () {
  return this.regex(/(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/, utils.templates.urlInvalid);
};

module.exports = Rule;


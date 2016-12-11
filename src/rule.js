'use strict';

var utils = require('./utils');

function Rule() {
  this.field = '';
  this.messages = [];
}

Rule.prototype.setField = function (field) {
  this.field = field;
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
    this.messages.push(message);
  }
  return this;
};

Rule.prototype.required = function (value) {
  if (utils.isEmpty(value)) {
    this.messages.push(utils.templates.required);
  }
  return this;
};

Rule.prototype.float = function (value) {
  if (!utils.isEmpty(value)) {
    var number = parseFloat(value);
    if (_.isNaN(number)) {
      this.messages.push(utils.templates.mustBeFloat);
    }
  }
};

Rule.prototype.integer = function (value) {
  if (!utils.isEmpty(value)) {
    var number = parseInt(value);
    if (_.isNaN(number)) {
      this.messages.push(utils.templates.mustBeInteger);
    }
  }
};

Rule.prototype.lessThan = function (value, bound) {
  if (!utils.isEmpty(value)) {
    var number = parseFloat(value);
    if (_.isNaN(number)) {
      this.messages.push(utils.templates.mustBeNumber);
    } else if (number >= bound) {
      this.messages.push(utils.templates.mustLessThan, bound);
    }
  }
};

Rule.prototype.lessThanOrEqualTo = function (value, bound) {
  if (!utils.isEmpty(value)) {
    var number = parseFloat(value);
    if (_.isNaN(number)) {
      this.messages.push(utils.templates.mustBeNumber);
    } else if (number > bound) {
      this.messages.push(utils.templates.mustLessThanOrEqualTo, bound);
    }
  }
};

Rule.prototype.greaterThan = function (value, bound) {
  if (!utils.isEmpty(value)) {
    var number = parseFloat(value);
    if (_.isNaN(number)) {
      this.messages.push(utils.templates.mustBeNumber);
    } else if (number <= bound) {
      this.messages.push(utils.templates.mustGreaterThan, bound);
    }
  }
};

Rule.prototype.greaterThanOrEqualTo = function (value, bound) {
  if (!utils.isEmpty(value)) {
    var number = parseFloat(value);
    if (_.isNaN(number)) {
      this.messages.push(utils.templates.mustBeNumber);
    } else if (number < bound) {
      this.messages.push(utils.templates.mustGreaterThanOrEqualTo, bound);
    }
  }
};

Rule.prototype.between = function (value, lowBound, highBound) {
  if (!utils.isEmpty(value)) {
    var number = parseFloat(value);
    if (_.isNaN(number)) {
      this.messages.push(utils.templates.mustBeNumber);
    } else if (number < lowBound || number > highBound) {
      this.messages.push(utils.templates.mustBetween, lowBound, highBound);
    }
  }
};

Rule.prototype.size = function (value, size) {
  if (!utils.isEmpty(value)) {
    if (_.isArray(value) && value.length != size) {
      this.messages.push(utils.format(utils.templates.sizeMustBe, size));
    }
  }
  return this;
};

Rule.prototype.length = function (value, length) {
  if (!utils.isEmpty(value)) {
    var string = String(value);
    if (string.length !== length) {
      this.messages.push(utils.format(utils.templates.lengthMustBe, length));
    }
  }
  return this;
};

Rule.prototype.minLength = function (value, length) {
  if (!utils.isEmpty(value)) {
    var string = String(value);
    if (string.length < length) {
      this.messages.push(utils.format(utils.templates.lengthAtLeast, length));
    }
  }
  return this;
};

Rule.prototype.maxLength = function (value, length) {
  if (!utils.isEmpty(value)) {
    var string = String(value);
    if (string.length > length) {
      this.messages.push(utils.format(utils.templates.lengthAtMost, length));
    }
  }
  return this;
};

Rule.prototype.lengthBetween = function (value, minLength, maxLength) {
  if (!utils.isEmpty(value)) {
    var string = String(value);
    if (string.length < minLength || string.length > maxLength) {
      this.messages.push(utils.format(utils.templates.lengthMustBetween, minLength, maxLength));
    }
  }
  return this;
};

Rule.prototype.in = function (value, options) {
  if (!utils.isEmpty(value)) {
    if (options.filter(function (option) {
        return option === value;
      }).length <= 0) {
      this.messages.push(utils.format(utils.templates.valueMustIn, utils.templates.optionCombiner(options)));
    }
  }
  return this;
};

Rule.prototype.notIn = function (value, options) {
  if (!utils.isEmpty(value)) {
    if (options.filter(function (option) {
        return option !== value;
      }).length <= 0) {
      this.messages.push(utils.format(utils.templates.valueMustNotIn, utils.templates.optionCombiner(options)));
    }
  }
  return this;
};

Rule.prototype.match = function (value, valueToCompare, message) {
  if (!utils.isEmpty(value)) {
    if (value !== valueToCompare) {
      this.messages.push(message || utils.templates.valueNotMatch);
    }
  }
  return this;
};

Rule.prototype.regex = function (value, regex, message) {
  if (!utils.isEmpty(value)) {
    if (!regex.test(value)) {
      this.messages.push(message || utils.templates.regexInvalid);
    }
  }
  return this;
};

Rule.prototype.digit = function (value) {
  return this.regex(value, /^\d*$/, utils.templates.digitInvalid);
};

Rule.prototype.email = function (value) {
  return this.regex(value, /^\w+@\w+?\.[a-zA-Z]{2,3}$/, utils.templates.emailInvalid);
};

Rule.prototype.url = function (value) {
  return this.regex(value, /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/, utils.templates.urlInvalid);
};

module.exports = Rule;


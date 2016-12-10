'use strict';

var _ = require('lodash');
var Promise = require('bluebird');

/* error bag
 ----------------------------------- */

function ValidationBag() {
  this.errors = [];
  this.validatingRecords = [];
  this.passedRecords = [];
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
  var existingPassedRecords = this.passedRecords.filter(function (validated) {
    return validated.field === field;
  });
  if (!_.isEmpty(existingPassedRecords)) {
    existingPassedRecords[0].value = true;
  } else {
    this.passedRecords.push({field: field, value: true});
  }
};

ValidationBag.prototype.resetPassed = function (field) {
  if (!field) {
    this.passedRecords = [];
  }

  var existingPassedRecords = this.passedRecords.filter(function (validated) {
    return validated.field === field;
  });
  if (!_.isEmpty(existingPassedRecords)) {
    existingPassedRecords[0].value = false;
  }
};

ValidationBag.prototype.isPassed = function (field) {
  var existingPassedRecords = this.passedRecords.filter(function (validated) {
    return validated.field === field;
  });
  return !_.isEmpty(existingPassedRecords) && existingPassedRecords[0].value;
};

// returns true if any error is added
ValidationBag.prototype.setError = function (field, message) {
  this.removeErrors(field);
  this.resetPassed(field);

  var messages = message instanceof Rule ? message.messages : (_.isArray(message) ? message : [message]);
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
  return this.setError(rule.field, rule.messages);
};

var validatingId = 0;

ValidationBag.newValidatingId = function () {
  return (++validatingId).toString();
};

/* rule
 ----------------------------------- */

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
          return Validator.templates.error;
        });
    }
    this.messages.push(message);
  }
  return this;
};

Rule.prototype.required = function (value) {
  if (Validator.isEmpty(value)) {
    this.messages.push(Validator.templates.required);
  }
  return this;
};

Rule.prototype.float = function (value) {
  if (!Validator.isEmpty(value)) {
    var number = parseFloat(value);
    if (_.isNaN(number)) {
      this.messages.push(Validator.templates.mustBeFloat);
    }
  }
};

Rule.prototype.integer = function (value) {
  if (!Validator.isEmpty(value)) {
    var number = parseInt(value);
    if (_.isNaN(number)) {
      this.messages.push(Validator.templates.mustBeInteger);
    }
  }
};

Rule.prototype.lessThan = function (value, bound) {
  if (!Validator.isEmpty(value)) {
    var number = parseFloat(value);
    if (_.isNaN(number)) {
      this.messages.push(Validator.templates.mustBeNumber);
    } else if (number >= bound) {
      this.messages.push(Validator.templates.mustLessThan, bound);
    }
  }
};

Rule.prototype.lessThanOrEqualTo = function (value, bound) {
  if (!Validator.isEmpty(value)) {
    var number = parseFloat(value);
    if (_.isNaN(number)) {
      this.messages.push(Validator.templates.mustBeNumber);
    } else if (number > bound) {
      this.messages.push(Validator.templates.mustLessThanOrEqualTo, bound);
    }
  }
};

Rule.prototype.greaterThan = function (value, bound) {
  if (!Validator.isEmpty(value)) {
    var number = parseFloat(value);
    if (_.isNaN(number)) {
      this.messages.push(Validator.templates.mustBeNumber);
    } else if (number <= bound) {
      this.messages.push(Validator.templates.mustGreaterThan, bound);
    }
  }
};

Rule.prototype.greaterThanOrEqualTo = function (value, bound) {
  if (!Validator.isEmpty(value)) {
    var number = parseFloat(value);
    if (_.isNaN(number)) {
      this.messages.push(Validator.templates.mustBeNumber);
    } else if (number < bound) {
      this.messages.push(Validator.templates.mustGreaterThanOrEqualTo, bound);
    }
  }
};

Rule.prototype.between = function (value, lowBound, highBound) {
  if (!Validator.isEmpty(value)) {
    var number = parseFloat(value);
    if (_.isNaN(number)) {
      this.messages.push(Validator.templates.mustBeNumber);
    } else if (number < lowBound || number > highBound) {
      this.messages.push(Validator.templates.mustBetween, lowBound, highBound);
    }
  }
};

Rule.prototype.size = function (value, size) {
  if (!Validator.isEmpty(value)) {
    if (_.isArray(value) && value.length != size) {
      this.messages.push(Validator.format(Validator.templates.sizeMustBe, size));
    }
  }
  return this;
};

Rule.prototype.length = function (value, length) {
  if (!Validator.isEmpty(value)) {
    var string = String(value);
    if (string.length !== length) {
      this.messages.push(Validator.format(Validator.templates.lengthMustBe, length));
    }
  }
  return this;
};

Rule.prototype.minLength = function (value, length) {
  if (!Validator.isEmpty(value)) {
    var string = String(value);
    if (string.length < length) {
      this.messages.push(Validator.format(Validator.templates.lengthMustGreaterThan, length));
    }
  }
  return this;
};

Rule.prototype.maxLength = function (value, length) {
  if (!Validator.isEmpty(value)) {
    var string = String(value);
    if (string.length > length) {
      this.messages.push(Validator.format(Validator.templates.lengthMustLessThan, length));
    }
  }
  return this;
};

Rule.prototype.lengthBetween = function (value, minLength, maxLength) {
  if (!Validator.isEmpty(value)) {
    var string = String(value);
    if (string.length < minLength || string.length > maxLength) {
      this.messages.push(Validator.format(Validator.templates.lengthMustBetween, minLength, maxLength));
    }
  }
  return this;
};

Rule.prototype.in = function (value, options) {
  if (!Validator.isEmpty(value)) {
    if (options.filter(function (option) {
        return option === value;
      }).length <= 0) {
      this.messages.push(Validator.format(Validator.templates.valueMustIn, Validator.templates.optionCombiner(options)));
    }
  }
  return this;
};

Rule.prototype.notIn = function (value, options) {
  if (!Validator.isEmpty(value)) {
    if (options.filter(function (option) {
        return option !== value;
      }).length <= 0) {
      this.messages.push(Validator.format(Validator.templates.valueMustNotIn, Validator.templates.optionCombiner(options)));
    }
  }
  return this;
};

Rule.prototype.match = function (value, valueToCompare, message) {
  if (!Validator.isEmpty(value)) {
    if (value !== valueToCompare) {
      this.messages.push(message || Validator.templates.valueNotMatch);
    }
  }
  return this;
};

Rule.prototype.regex = function (value, regex, message) {
  if (!Validator.isEmpty(value)) {
    if (!regex.test(value)) {
      this.messages.push(message || Validator.templates.regexInvalid);
    }
  }
  return this;
};

Rule.prototype.digit = function (value) {
  return this.regex(value, /^\d*$/, Validator.templates.digitInvalid);
};

Rule.prototype.email = function (value) {
  return this.regex(value, /^\w+@\w+?\.[a-zA-Z]{2,3}$/, Validator.templates.emailInvalid);
};

Rule.prototype.url = function (value) {
  return this.regex(value, /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/, Validator.templates.urlInvalid);
};

var Validator = {};

// clone methods from Rule to Validator
_.keys(Rule.prototype).forEach(function (methodName) {
  Validator[methodName] = function () {
    var rule = new Rule();
    return rule[methodName].apply(rule, arguments);
  };
});

Validator.create = function () {
  return new Rule();
};

Validator.isEmpty = function (value) {
  if (_.isArray(value)) {
    return !value.length;
  } else if (value === undefined || value === null) {
    return true;
  } else {
    return !String(value).trim().length;
  }
};

Validator.format = function (template) {
  var args = Array.prototype.slice.call(arguments, 1);
  return template.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
};

Validator.templates = {
  error: 'Error.',
  required: 'Required.',
  mustBeFloat: 'Must be number.',
  mustBeInteger: 'Must be integer.',
  mustBeNumber: 'Must be number.',
  mustLessThan: 'Must less than {0}.',
  mustLessThanOrEqualTo: 'Must less than or equal to {0}.',
  mustGreaterThan: 'Must greater than {0}.',
  mustGreaterThanOrEqualTo: 'Must greater than or equal to {0}.',
  mustBetween: 'Must between {0} and {1}.',
  sizeMustBe: 'Size must be {0}.',
  lengthMustBe: 'Length must be {0}.',
  lengthMustGreaterThan: 'Length must greater than {0}.',
  lengthMustLessThan: 'Length must less than {0}.',
  lengthMustBetween: 'Length must between {0} and {1}.',
  valueMustIn: 'Must be {0}.',
  valueMustNotIn: 'Must not be {0}.',
  valueNotMatch: 'Not matched.',
  regexInvalid: 'Invalid format.',
  digitInvalid: 'Must be digit.',
  emailInvalid: 'Invalid email.',
  urlInvalid: 'Invalid url.',
  optionCombiner: function (options) {
    if (options.length > 2) {
      options = [options.slice(0, options.length - 1).join(', '), options[options.length - 1]];
    }
    return options.join(' or ');
  }
};

/* mixin
 ----------------------------------- */

var mixin = {

  created: function () {
    // validate methods contains all application validate codes
    var validateMethods = [];
    this.$options.validateMethods = validateMethods;
    // generate validate methods and watch properties change for validators
    var validators = this.$options.validators;
    if (validators) {
      _.keys(validators).forEach(function (key) {
        var properties = key.split(',');
        properties = properties.map(function (property) {
          return property.trim();
        });
        var getters = properties.map(function (property) {
          return generateGetter(this, property);
        }, this);
        var validator = validators[key];
        var options = {};
        if (!_.isFunction(validator)) {
          options = _.omit(validator, 'validator');
          validator = validator.validator;
        }
        if (options.cache) {
          // cache the last validation result, so that async validator can be fast when submitting the form
          validator = cache(validator);
        }
        var validateMethod = function () {
          var args = getters.map(function (getter) {
            return getter();
          });
          var rule = validator.apply(this, args);
          if (rule) {
            if (!rule.field) {
              // field defaults to the first property
              rule.setField(properties[0]);
            }
            return this.validation.checkRule(rule);
          } else {
            return Promise.resolve(false);
          }
        }.bind(this);
        //TODO unwatch
        watchProperties(this, properties, validateMethod);
        validateMethods.push(validateMethod);
      }, this);
    }
  },

  data: function () {
    return {
      validation: new ValidationBag()
    };
  },

  methods: {
    $validateAll: function () {
      var validateMethods = this.$options.validateMethods;
      if (_.isEmpty(validateMethods)) {
        return Promise.resolve(true);
      } else {
        return Promise
          .all(validateMethods.map(function (validateMethod) {
            return validateMethod();
          }))
          .bind(this)
          .then(function (results) {
            return results.filter(function (result) {
                return !!result;
              }).length <= 0;
          });
      }
    }
  }
};

function generateGetter(vm, property) {
  var names = property.split('.');
  return function () {
    var value = vm;
    for (var i = 0; i < names.length; i++) {
      if (_.isNull(value) || _.isUndefined(value)) {
        break;
      }
      value = value[names[i]];
    }
    return value;
  };
}

function watchProperties(vm, properties, callback) {
  var debouncedCallback = _.debounce(callback, 300);
  properties.forEach(function (property) {
    vm.$watch(property, debouncedCallback);
  });
}

var validatorResultCache = {};

function cache(validator) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var cache = validatorResultCache[validator];
    if (!cache) {
      cache = {};
      validatorResultCache[validator] = cache;
    }
    if (!_.isUndefined(cache.args) && _.isEqual(args, cache.args)) {
      return cache.rule;
    }
    var result = validator.apply(this, args);
    if (result && result.then) {
      return result.then(function (rule) {
        cache.args = args;
        cache.rule = rule;
      });
    } else {
      cache.args = args;
      cache.rule = result;
      return result;
    }
  };
}

/* plugin install
 ----------------------------------- */

var installed;

function install(Vue) {
  if (installed) {
    return;
  }
  installed = true;
  Vue.mixin(mixin);
}

/* exports
 ----------------------------------- */

module.exports.ValidationBag = ValidationBag;
module.exports.Rule = Rule;
module.exports.Validator = Validator;
module.exports.install = install;

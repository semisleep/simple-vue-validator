'use strict';

var utils = require('./utils');
var ValidationBag = require('./validation-bag');

var mixin = {

  Promise: null,

  created: function () {
    this.$setValidators(this.$options.validators);

    if (this.validation) {
      // set vm to validation
      this.validation._setVM(this);
    }
  },

  beforeDestroy: function () {
    unwatch(this.$options.validatorsUnwatchCallbacks);
  },

  data: function () {
    if (this.$options.validators) {
      return {
        validation: new ValidationBag()
      };
    }
    return {};
  },

  methods: {
    $setValidators: function (validators) {
      unwatch(this.$options.validatorsUnwatchCallbacks);
      // validate methods contains all application validate codes
      var validateMethods = {};
      this.$options.validateMethods = validateMethods;
      var unwatchCallbacks = [];
      this.$options.validatorsUnwatchCallbacks = unwatchCallbacks;
      // generate validate methods and watch properties change for validators
      if (validators) {
        Object.keys(validators).forEach(function (key) {
          var properties = key.split(',');
          properties = properties.map(function (property) {
            return property.trim();
          });
          var getters = properties.map(function (property) {
            return generateGetter(this, property);
          }, this);
          var validator = validators[key];
          var options = {};
          if (!utils.isFunction(validator)) {
            options = utils.omit(validator, 'validator');
            validator = validator.validator;
          }
          if (options.cache) {
            // cache the validation result, so that async validator can be fast when submitting the form
            var option = options.cache === 'last' ? 'last' : 'all';
            validator = cache(validator, option);
          }
          var validateMethod = function () {
            var args = getters.map(function (getter) {
              return getter();
            });
            var rule = validator.apply(this, args);
            if (rule) {
              if (!rule._field) {
                // field defaults to the first property
                rule.field(properties[0]);
              }
              return this.validation.checkRule(rule);
            } else {
              return getPromise().resolve(false);
            }
          }.bind(this);

          // add to validate method list
          validateMethods[properties[0]] = validateMethod;

          // watch change and invoke validate method
          var validateMethodForWatch = validateMethod;
          if (options.debounce) {
            // TODO what if custom field name is used?
            var decoratedValidateMethod = function () {
              if (decoratedValidateMethod.sessionId !== this.validation.sessionId) {
                // skip validation if it's reset before
                return getPromise().resolve(false);
              }
              return validateMethod.apply(this, arguments);
            }.bind(this);
            var debouncedValidateMethod = utils.debounce(decoratedValidateMethod, parseInt(options.debounce));
            var field = properties[0];
            validateMethodForWatch = function () {
              // eagerly resetting passed flag if debouncing is used.
              this.validation.resetPassed(field);
              // store sessionId
              decoratedValidateMethod.sessionId = this.validation.sessionId;
              debouncedValidateMethod.apply(this, arguments);
            }.bind(this);
          }
          watchProperties(this, properties, validateMethodForWatch).forEach(function (unwatch) {
            unwatchCallbacks.push(unwatch);
          });
        }, this);
      }
    },
    $validate: function (fields) {
      var validateMethods = this.$options.validateMethods;
      if (utils.isUndefined(fields)) {
        validateMethods = Object.keys(validateMethods).map(function (key) {
          return validateMethods[key];
        });
      } else {
        fields = utils.isArray(fields) ? fields : [fields];
        validateMethods = fields.map(function (field) {
          return validateMethods[field];
        });
      }
      if (utils.isEmpty(validateMethods)) {
        return getPromise().resolve(true);
      } else {
        return getPromise()
          .all(validateMethods.map(function (validateMethod) {
            return validateMethod();
          }))
          .then(function (results) {
            return results.filter(function (result) {
                return !!result;
              }).length <= 0;
          }.bind(this));
      }
    }
  }
};

function unwatch(list) {
  if (list) {
    list.forEach(function (unwatch) {
      unwatch();
    });
  }
}

function generateGetter(vm, property) {
  var names = property.split('.');
  return function () {
    var value = vm;
    for (var i = 0; i < names.length; i++) {
      if (utils.isNull(value) || utils.isUndefined(value)) {
        break;
      }
      value = value[names[i]];
    }
    return value;
  };
}

function watchProperties(vm, properties, callback) {
  return properties.map(function (property) {
    return vm.$watch(property, function () {
      vm.validation.setTouched(property);
      callback.call();
    });
  });
}

function cache(validator, option) {
  return function () {
    var cache = validator.cache;
    if (!cache) {
      cache = [];
      validator.cache = cache;
    }
    var args = Array.prototype.slice.call(arguments);
    var cachedResult = findInCache(cache, args);
    if (!utils.isUndefined(cachedResult)) {
      return cachedResult;
    }
    var result = validator.apply(this, args);
    if (!utils.isUndefined(result)) {
      if (result.then) {
        return result.tab(function (promiseResult) {
          if (!utils.isUndefined(promiseResult)) {
            if (option !== 'all') {
              cache.splice(0, cache.length);
            }
            cache.push({args: args, result: promiseResult});
          }
        });
      } else {
        if (option !== 'all') {
          cache.splice(0, cache.length);
        }
        cache.push({args: args, result: result});
        return result;
      }
    }
  };
}

function getPromise() {
  if (mixin.Promise) {
    return mixin.Promise;
  }
  return require('es6-promise').Promise;
}

function findInCache(cache, args) {
  var items = cache.filter(function (item) {
    return utils.isEqual(args, item.args);
  });
  if (!utils.isEmpty(items)) {
    return items[0].result;
  }
}

module.exports = mixin;

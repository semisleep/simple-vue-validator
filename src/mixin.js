'use strict';

var _ = require('lodash/core');
var omit = require('lodash/omit');
var debounce = require('lodash/debounce');
var Promise = require('bluebird');
var ValidationBag = require('./validation-bag');

var mixin = {

  created: function () {
    // validate methods contains all application validate codes
    var validateMethods = [];
    this.$options.validateMethods = validateMethods;
    var unwatchCallbacks = [];
    this.$options.unwatchCallbacks = unwatchCallbacks;
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
          options = omit(validator, 'validator');
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
            return Promise.resolve(false);
          }
        }.bind(this);

        // add to validate method list
        validateMethods.push(validateMethod);

        // watch change and invoke validate method
        var validateMethodForWatch = validateMethod;
        if (options.debounce) {
          // TODO what if custom field name is used?
          var decoratedValidateMethod = function() {
            if (decoratedValidateMethod.sessionId !== this.validation.sessionId) {
              // skip validation if it's reset before
              return Promise.resolve(false);
            }
            return validateMethod.apply(this, arguments);
          }.bind(this);
          var debouncedValidateMethod = debounce(decoratedValidateMethod, parseInt(options.debounce));
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

  beforeDestroy: function () {
    this.$options.unwatchCallbacks.forEach(function (unwatch) {
      unwatch();
    });
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
    $validate: function () {
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
    if (!_.isUndefined(cachedResult)) {
      return cachedResult;
    }
    var result = validator.apply(this, args);
    if (!_.isUndefined(result)) {
      if (result.then) {
        return result.tab(function (promiseResult) {
          if (!_.isUndefined(promiseResult)) {
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

function findInCache(cache, args) {
  var items = cache.filter(function (item) {
    return _.isEqual(args, item.args);
  });
  if (!_.isEmpty(items)) {
    return items[0].result;
  }
}

module.exports = mixin;
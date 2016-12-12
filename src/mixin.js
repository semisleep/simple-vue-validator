'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var ValidationBag = require('./validation-bag');

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
            if (!rule._field) {
              // field defaults to the first property
              rule.field(properties[0]);
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
  var debouncedCallback = _.debounce(callback, 200);
  properties.forEach(function (property) {
    vm.$watch(property, function() {
      vm.validation.setTouched(property);
      debouncedCallback.call();
    });
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

module.exports = mixin;
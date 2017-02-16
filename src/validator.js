'use strict';

var utils = require('./utils');
var Rule = require('./rule');

var Validator = newValidator();

Validator.create = function(options) {
  return newValidator(options);
};

function newValidator(options) {
  options = options || {};
  var validator = {};

  // clone methods from Rule to validator
  Object.keys(Rule.prototype).forEach(function (methodName) {
    validator[methodName] = function () {
      var rule = new Rule(options.templates);
      return rule[methodName].apply(rule, arguments);
    };
  });

  validator.isEmpty = utils.isEmpty;

  validator.format = utils.format;

  return validator;
}

module.exports = Validator;

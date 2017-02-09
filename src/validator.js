'use strict';

var utils = require('./utils');
var Rule = require('./rule');

var Validator = {};

// clone methods from Rule to Validator
Object.keys(Rule.prototype).forEach(function (methodName) {
  Validator[methodName] = function () {
    var rule = new Rule();
    return rule[methodName].apply(rule, arguments);
  };
});

Validator.create = function () {
  return new Rule();
};

Validator.isEmpty = utils.isEmpty;

Validator.format = utils.format;

Validator.extendTemplates = function(newTemplate) {
  Object.keys(newTemplates).forEach(function (key) {
    utils.templates[key] = newTemplate[key];
  });
};

module.exports = Validator;

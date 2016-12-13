'use strict';

var _ = require('lodash');

module.exports.isEmpty = function (value) {
  if (_.isArray(value)) {
    return !value.length;
  } else if (value === undefined || value === null) {
    return true;
  } else {
    return !String(value).trim().length;
  }
};

module.exports.format = function (template) {
  var args = Array.prototype.slice.call(arguments, 1);
  return template.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
};

module.exports.templates = require('./templates');
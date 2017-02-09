'use strict';

var deepEqual = require('deep-equal');

module.exports.format = function (template) {
  var args = Array.prototype.slice.call(arguments, 1);
  return template.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
};

module.exports.isArray = function isArray(arg) {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(arg);
  }

  return Object.prototype.toString.call(arg) === '[object Array]';
};

module.exports.isEmpty = function (value) {
  if (isArray(value)) {
    return !value.length;
  } else if (value === undefined || value === null) {
    return true;
  } else {
    return !String(value).trim().length;
  }
};

module.exports.isEqual = function isEqual(o1, o2) {
  return deepEqual(o1, o2);
};

module.exports.isFunction = function isFunction(arg) {
  return typeof arg === 'function';
};

module.exports.isNaN = function isNaN(arg) {
  return arg !== arg;
};

module.exports.isNull = function isNull(arg) {
  return arg === null;
};

module.exports.isString = function isString(arg) {
  return typeof arg === 'string' || arg instanceof String;
};

module.exports.isUndefined = function isUndefined(arg) {
  return typeof arg === 'undefined';
};

module.exports.templates = require('./templates');


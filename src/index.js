'use strict';

var ValidationBag = require('./validation-bag');
var Rule = require('./rule');
var Validator = require('./validator');
var mixin = require('./mixin');
var utils = require('./utils');

/* plugin install
 ----------------------------------- */

function install(Vue, options) {
  Vue.mixin(mixin);
  if (options && options.templates) {
    extendTemplates(options.templates);
  }
  if (options && options.mode) {
    setMode(options.mode);
  }
  if (options && options.Promise) {
    mixin.Promise = options.Promise;
  }
}

function extendTemplates(newTemplates) {
  Object.keys(newTemplates).forEach(function (key) {
    utils.templates[key] = newTemplates[key];
  });
}

function setMode(mode) {
  if (mode !== 'interactive' && mode !== 'conservative' && mode !== 'manual') {
    throw new Error('Invalid mode: ' + mode);
  }
  utils.mode = mode;
}

/* exports
 ----------------------------------- */

module.exports.name = 'SimpleVueValidator';
module.exports.ValidationBag = ValidationBag;
module.exports.Rule = Rule;
module.exports.Validator = Validator;
module.exports.mixin = mixin;
module.exports.install = install;
module.exports.extendTemplates = extendTemplates;
module.exports.setMode = setMode;

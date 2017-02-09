'use strict';

var ValidationBag = require('./validation-bag');
var Rule = require('./rule');
var Validator = require('./validator');
var mixin = require('./mixin');

/* plugin install
 ----------------------------------- */

function install(Vue, options) {
  Vue.mixin(mixin);
  if (options && options.templates) {
    Validator.extendTemplates(options.templates);
  }
  if (options && options.Promise) {
    mixin.Promise = options.Promise;
  }
}

/* exports
 ----------------------------------- */

module.exports.name = 'SimpleVueValidator';
module.exports.ValidationBag = ValidationBag;
module.exports.Rule = Rule;
module.exports.Validator = Validator;
module.exports.mixin = mixin;
module.exports.install = install;

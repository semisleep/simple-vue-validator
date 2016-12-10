'use strict';

var ValidationBag = require('./validation-bag');
var Rule = require('./rule');
var Validator = require('./validator');
var mixin = require('./mixin');

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

module.exports.name = 'SimpleVueValidator';
module.exports.ValidationBag = ValidationBag;
module.exports.Rule = Rule;
module.exports.Validator = Validator;
module.exports.mixin = mixin;
module.exports.install = install;

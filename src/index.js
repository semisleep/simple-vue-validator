'use strict';

var ValidationBag = require('./validation-bag');
var Rule = require('./rule');
var Validator = require('./validator');
var mixin = require('./mixin');

/* plugin install
 ----------------------------------- */

function install(Vue, options) {
  Vue.mixin(mixin);
  if (options && options.messages) {
    Validator.extendTemplates(options.messages);
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

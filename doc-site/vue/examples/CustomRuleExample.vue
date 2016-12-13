<template>
  <div class="layout-form">
    <div class="form-group" :class="{error: validation.hasError('oddNumber')}">
      <div class="label">Number</div>
      <div class="content"><input type="text" class="form-control" v-model="oddNumber" placeholder="only accept odd number"/></div>
      <div class="message">{{ validation.firstError('oddNumber') }}</div>
    </div>
  </div>
</template>

<script type="text/javascript">
  var Vue = require('vue');
  var SimpleVueValidation = require('../../../src/');
  var Validator = SimpleVueValidation.Validator;

  Vue.use(SimpleVueValidation);

  module.exports = {
    data: function () {
      return {
        oddNumber: ''
      };
    },
    validators: {
      oddNumber: function (value) {
        return Validator.custom(function () {
          if (!Validator.isEmpty(value)) {
            var number = parseInt(value);
            if (isNaN(number) || number % 2 !== 1) {
              return 'Not an odd number!!!'
            }
          }
        });
      }
    }
  }
</script>
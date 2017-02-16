<template>
  <div class="layout-form">
    <div class="form-group" :class="{error: validation.hasError('star')}">
      <div class="label">行星</div>
      <div class="content"><input type="text" class="form-control" v-model="star"/></div>
      <div class="message">{{ validation.firstError('star') }}</div>
    </div>
  </div>
</template>

<script type="text/javascript">
  var Vue = require('vue');
  var SimpleVueValidation = require('../../../src/');
  var Validator = SimpleVueValidation.Validator;

  SimpleVueValidation.extendTemplates({
    in: '必须是 {0} 中的任意一个.',
    optionCombiner: function (options) {
      if (options.length > 2) {
        options = [options.slice(0, options.length - 1).join('，'), options[options.length - 1]];
      }
      return options.join(' 或 ');
    }
  });

  Vue.use(SimpleVueValidation);

  module.exports = {
    data: function () {
      return {
        star: ''
      };
    },
    validators: {
      star: function (value) {
        return Validator.value(value).in(['地球', '火星', '木星', '土星']);
      }
    }
  }
</script>
<template>
  <div class="layout-form">
    <div class="form-group" :class="{error: validation.hasError('email')}">
      <div class="label">Email</div>
      <div class="content"><input type="text" class="form-control" v-model="email"/></div>
      <div class="message">{{ validation.firstError('email') }}</div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import Vue from 'vue';
  import SimpleVueValidation from '../../../src/';
  const Validator = SimpleVueValidation.Validator;

  Vue.use(SimpleVueValidation);

  module.exports = {
    data: function () {
      return {
        email: ''
      };
    },
    validators: {
      email: function (value) {
        return Validator.value(value).email('That doesn\'t look like a valid email address.');
      }
    }
  }
</script>
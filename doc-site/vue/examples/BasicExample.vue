<template>
  <div class="layout-form">
    <div class="form-group" :class="{error: validation.hasError('email')}">
      <div class="label">Email</div>
      <div class="content"><input class="form-control" v-model="email" /></div>
      <div class="message">{{ validation.firstError('email') }}</div>
    </div>
    <div class="form-group">
      <div class="actions"><button type="button" @click="submit">Submit</button></div>
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
        email: ''
      };
    },
    validators: {
      email: function(value) {
        return Validator.required(value).email(value);
      }
    },
    methods: {
      submit: function() {
        this.$validate()
          .then(function(success) {
            if (success) {
              alert('Validation succeeded!')
            }
          });
      }
    }
  }
</script>
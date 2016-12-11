<template>
  <div class="layout-form">
    <div class="form-group" :class="{error: validation.hasError('name')}">
      <div class="label">Name</div>
      <div class="content"><input class="form-control" v-model="name" /></div>
      <div class="message">{{ validation.firstError('name') }}</div>
    </div>
    <div class="form-group" :class="{error: validation.hasError('email')}">
      <div class="label">Email</div>
      <div class="content"><input class="form-control" v-model="email" /></div>
      <div class="message">{{ validation.firstError('email') }}</div>
    </div>
    <div class="form-group">
      <div class="actions"><button type="button" @click="tryIt">Try It</button></div>
    </div>
  </div>
</template>

<script type="text/javascript">
  var Vue = require('vue');
  var SimpleValidationPlugin = require('../../../src/');
  var Validator = SimpleValidationPlugin.Validator;

  Vue.use(SimpleValidationPlugin);

  module.exports = {
    name: 'BasicExample',
    data: function () {
      return {
        name: '',
        email: ''
      };
    },
    validators: {
      name: function(value) {
        return Validator.required(value).minLength(value, 6);
      },
      email: function(value) {
        return Validator.required(value).email(value);
      }
    },
    methods: {
      tryIt: function() {
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
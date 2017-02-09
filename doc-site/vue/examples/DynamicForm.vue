<template>
  <div>
    <div class="form-group" :class="{error: validation.hasError('key')}">
      <div class="label">* Key</div>
      <div class="content"><input type="text" class="form-control" v-model="key" placeholder="only accepts alphabetic characters" /></div>
      <div class="message">{{ validation.firstError('key') }}</div>
    </div>
    <div class="form-group" :class="{error: validation.hasError('value')}">
      <div class="label">* Value</div>
      <div class="content"><input type="text" class="form-control" v-model="value" placeholder="only accepts digits" /></div>
      <div class="message">{{ validation.firstError('value') }}</div>
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
        key: '',
        value: ''
      };
    },
    validators: {
      key: function(value) {
        return Validator.value(value).required().regex('^[A-Za-z]*$', 'Must only contain alphabetic characters.');
      },
      value: function(value) {
        return Validator.value(value).required().digit();
      }
    },
    methods: {
      validate: function() {
        this.$validate()
          .then(function(success) {
            if (success) {
              return {key: this.key, value: this.value}
            }
          }.bind(this));
      },
      reset: function() {
        this.validation.reset();
      }
    }
  }
</script>
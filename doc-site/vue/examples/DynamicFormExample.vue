<template>
  <div class="layout-form">
    <hr>
    <template v-for="n in 3">
      <DynamicForm ref="forms"/>
      <hr>
    </template>
    <div class="form-group">
      <div class="actions">
        <button type="button" class="btn btn-default" @click="reset">Reset</button>
        <button type="button" class="btn btn-primary" @click="submit">Submit</button>
      </div>
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
      };
    },
    methods: {
      submit: function () {
        Promise
          .all(this.$refs.forms.map(function (form) {
            return form.validate();
          }))
          .then(function (results) {
            if (results.filter(function(result) {
                return !result;
              }).length === 0) {
              alert('Validation succeeded!');
            }
          });
      },
      reset: function() {
        this.$refs.forms.forEach(function (form) {
          return form.reset();
        });
      }
    }
  }
</script>
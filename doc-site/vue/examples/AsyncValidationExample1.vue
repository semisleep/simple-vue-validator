<template>
  <div class="layout-form">
    <div class="form-group" :class="{error: validation.hasError('domain')}">
      <div class="label">Domain</div>
      <div class="content"><input type="text" class="form-control" v-model="domain" placeholder="only vuejs.org is available, others are taken"/></div>
      <div class="message">
        {{ validation.firstError('domain') }}
        <i v-if="validation.isValidating('domain')" class="fa fa-spinner fa-spin"></i>
        <i v-if="domain && validation.isPassed('domain')" class="text-success fa fa-check-circle"></i>
      </div>
    </div>
    <div class="form-group">
      <div class="actions">
        <button type="button" class="btn btn-default" @click="reset">Reset</button>
        <button type="button" class="btn btn-primary" @click="submit">Submit</button>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import Promise from 'bluebird';
  import Vue from 'vue';
  import SimpleVueValidation from '../../../src/';
  const Validator = SimpleVueValidation.Validator;

  Vue.use(SimpleVueValidation);

  module.exports = {
    data: function () {
      return {
        domain: ''
      };
    },
    validators: {
      domain: function (value) {
        return Validator.value(value).required().maxLength(20).custom(function () {
          if (!Validator.isEmpty(value)) {
            return Promise.delay(1000)
              .then(function () {
                if (value !== 'vuejs.org') {
                  return 'Already taken!';
                }
              });
          }
        });
      }
    },
    methods: {
      submit: function () {
        this.$validate()
          .then(function (success) {
            if (success) {
              alert('Validation succeeded!');
            }
          });
      },
      reset: function () {
        this.validation.reset();
      }
    }
  }
</script>
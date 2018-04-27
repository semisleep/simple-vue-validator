<template>
  <div class="layout-form">
    <div class="form-group" :class="{error: validation.hasError('url')}">
      <div class="label">URL</div>
      <div class="content"><input type="text" class="form-control" v-model="url"/></div>
      <div class="message">{{ validation.firstError('url') }}</div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import Vue from 'vue';
  import SimpleVueValidation from '../../../src/';
  const Validator = SimpleVueValidation.Validator.create({templates: {
    url: 'That doesn\'t look like a valid url.'
  }});

  Vue.use(SimpleVueValidation);

  module.exports = {
    data: function () {
      return {
        url: ''
      };
    },
    validators: {
      url: function (value) {
        return Validator.value(value).url();
      }
    }
  }
</script>
<template>
  <div class="layout-form">
    <div class="form-group" :class="{error: validation.hasError('colors')}">
      <div class="label">* Colors</div>
      <div class="content">
        <CheckboxGroup inline="true" :items="[
        {label:'red', value:'red'},
        {label:'green', value:'green'},
        {label:'blue', value:'blue'},
        {label:'white', value:'white'},
        {label:'black', value:'black'},
        ]" v-model="colors" />
      </div>
      <div class="message">{{ validation.firstError('colors') }}</div>
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
        colors: []
      };
    },
    validators: {
      colors: function (value) {
        return Validator.value(value).required().size(2);
      }
    }
  }
</script>
<template>
  <div class="layout-form">
    <div class="form-group">
      <div class="label">Fruit</div>
      <div class="content">
        <label>
          <input type="radio" class="form-control" name="fruit" value="apple" v-model="fruit"/>
          Apple
        </label>
        <label>
          <input type="radio" class="form-control" name="fruit" value="orange" v-model="fruit"/>
          Orange
        </label>
        <label>
          <input type="radio" class="form-control" name="fruit" value="other" v-model="fruit"/>
          Other fruit (please specify)
        </label>
      </div>
    </div>
    <div v-if="fruit === 'other'" class="form-group" :class="{error: validation.hasError('other')}">
      <div class="label">* Other</div>
      <div class="content"><input type="text" class="form-control" v-model="other" placeholder="please specify another fruit"/></div>
      <div class="message">{{ validation.firstError('other') }}</div>
    </div>
    <div class="form-group">
      <div class="actions">
        <button type="button" class="btn btn-primary" @click="submit">Submit</button>
      </div>
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
        fruit: '',
        other: '',
        submitted: false
      };
    },
    validators: {
      'other, fruit': function (other, fruit) {
        if (fruit !== 'other') {
          return;
        }
        if (this.submitted || this.validation.isTouched('other')) {
          return Validator.value(other).required();
        }
      }
    },
    methods: {
      submit: function () {
        this.submitted = true;
        this.$validate()
          .then(function(success) {
            if (success) {
              alert('Validation succeeded!');
            }
          });
      }
    }
  }
</script>
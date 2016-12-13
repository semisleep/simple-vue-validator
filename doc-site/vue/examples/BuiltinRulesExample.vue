<template>
  <div class="layout-form">
    <div class="form-group" :class="{error: validation.hasError('name')}">
      <div class="label">* Name</div>
      <div class="content"><input type="text" class="form-control" v-model="name" placeholder="only accepts alphabetic characters" /></div>
      <div class="message">{{ validation.firstError('name') }}</div>
    </div>
    <div class="form-group" :class="{error: validation.hasError('gender')}">
      <div class="label">* Gender</div>
      <div class="content">
        <label>
          <input type="radio" class="form-control" name="gender" value="mail" v-model="gender" />
          Male
        </label>
        <label>
          <input type="radio" class="form-control" name="gender" value="female" v-model="gender" />
          Female
        </label>
      </div>
      <div class="message">{{ validation.firstError('gender') }}</div>
    </div>
    <div class="form-group" :class="{error: validation.hasError('phone')}">
      <div class="label">Phone</div>
      <div class="content"><input type="text" class="form-control" v-model="phone" /></div>
      <div class="message">{{ validation.firstError('phone') }}</div>
    </div>
    <div class="form-group" :class="{error: validation.hasError('age')}">
      <div class="label">Age</div>
      <div class="content"><input type="text" class="form-control" v-model="age" /></div>
      <div class="message">{{ validation.firstError('age') }}</div>
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
  var Vue = require('vue');
  var SimpleVueValidation = require('../../../src/');
  var Validator = SimpleVueValidation.Validator;

  Vue.use(SimpleVueValidation);

  module.exports = {
    data: function () {
      return {
        name: '',
        gender: '',
        phone: '',
        age: ''
      };
    },
    validators: {
      name: function(value) {
        return Validator.value(value).required().regex('^[A-Za-z]*$', 'Must only contain alphabetic characters.');
      },
      gender: function(value) {
        return Validator.value(value).required();
      },
      phone: function(value) {
        return Validator.value(value).digit().length(10);
      },
      age: function(value) {
        return Validator.value(value).integer().greaterThan(12);
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
      },
      reset: function() {
        this.name = '';
        this.gender = '';
        this.phone = '';
        this.age = '';
        this.validation.reset();
      }
    }
  }
</script>
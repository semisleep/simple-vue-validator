<template>
  <div :class="{'inline':inline, 'block':!inline}">
    <div class="i-checks" :class="{'i-checks-inline':inline}" v-for="item in items">
      <label>
        <input type="checkbox" :name="name" :value="item.value">
        {{ item.label }}
      </label>
    </div>
  </div>
</template>

<script type="text/javascript">
  'use strict';

  import _ from 'lodash';
  import $ from 'jquery';
  import 'icheck';

  module.exports = {
    name: 'Radio',
    props: ['inline', 'name', 'value', 'items'],
    watch: {
      value: function(newValue) {
        this.updateValue(newValue);
      }
    },
    methods: {
      updateValue: function(newValues) {
        var el = $(this.$el);
        var inputs = el.find('input');
        inputs.each(function(index, input) {
          input = $(input);
          if (_.some(newValues, function(newValue) {
              return newValue === input.val();
            })) {
            input.iCheck('check');
          } else {
            input.iCheck('uncheck');
          }
        });
      }
    },
    mounted: function () {
      var el = $(this.$el);
      var labels = el.find('label');
      var inputs = labels.find('input');
      labels.on('ifChanged', function () {
        var values = [];
        inputs.each(function(index, input) {
          input = $(input);
          if (input.prop('checked')) {
            values.push(input.val());
          }
        });
        this.$emit('input', values);
      }.bind(this));
      inputs.iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
      });
      this.updateValue(this.value);
    },
    beforeDestroy: function() {
      var el = $(this.$el);
      var labels = el.find('label');
      var inputs = labels.find('input');
      labels.off('ifchanged');
      inputs.iCheck('destroy');
    }
  }
</script>
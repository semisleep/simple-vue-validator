'use strict';

var Vue = require('vue');
var VueSimpleValidator = require('../src');
var App = require('./vue/App.vue');

new Vue({
  el: '#app',
  render: function (h) {
    return h(App);
  }
});

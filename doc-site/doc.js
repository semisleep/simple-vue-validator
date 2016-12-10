'use strict';

require('prismjs');

var Vue = require('vue');
var VueResource = require('vue-resource');
var VueSimpleValidator = require('../src');
var App = require('./vue/App.vue');

Vue.use(VueResource);
Vue.use(VueSimpleValidator);

Vue.component('LeftNavBar', require('./vue/LeftNavBar.vue'));
Vue.component('MainContent', require('./vue/MainContent.vue'));

// chapters
Vue.component('GettingStarted', require('./vue/sections/GettingStarted.vue'));

// examples
Vue.component('BasicExample', require('./vue/examples/BasicExample.vue'));

new Vue({
  el: '#app',
  render: function (h) {
    return h(App);
  }
});

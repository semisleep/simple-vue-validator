'use strict';

require('prismjs');

var Vue = require('vue');
var VueSimpleValidator = require('../src');
var App = require('./vue/App.vue');

Vue.use(VueSimpleValidator);

Vue.component('LeftNavBar', require('./vue/LeftNavBar.vue'));
Vue.component('MainContent', require('./vue/MainContent.vue'));
Vue.component('DemoWithCode', require('./vue/DemoWithCode.vue'));

// chapters
Vue.component('GettingStarted', require('./vue/chapters/GettingStarted.vue'));

// examples
Vue.component('BasicExample', require('./vue/examples/BasicExample.vue'));

new Vue({
  el: '#app',
  render: function (h) {
    return h(App);
  }
});

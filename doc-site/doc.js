'use strict';

import 'prismjs';

import Vue from 'vue';
import VueSimpleValidator from '../src';
import App from './vue/App.vue';

import LeftNavBar from './vue/LeftNavBar.vue';
import MainContent from './vue/MainContent.vue';
import DemoWithCode from './vue/DemoWithCode.vue';
import GettingStarted from './vue/chapters/GettingStarted.vue';
import UsagesAndExamples from './vue/chapters/UsagesAndExamples.vue';
import Miscellaneous from './vue/chapters/Miscellaneous.vue';
import APIAndReference from './vue/chapters/APIAndReference.vue';

import BasicExample from './vue/examples/BasicExample.vue';
import BuiltinRulesExample from './vue/examples/BuiltinRulesExample.vue';
import CustomRuleExample from './vue/examples/CustomRuleExample.vue';
import CrossFieldValidationExample1 from './vue/examples/CrossFieldValidationExample1.vue';
import CrossFieldValidationExample2 from './vue/examples/CrossFieldValidationExample2.vue';
import AsyncValidationExample1 from './vue/examples/AsyncValidationExample1.vue';
import AsyncValidationExample2 from './vue/examples/AsyncValidationExample2.vue';
import CheckboxGroup from './vue/examples/CheckboxGroup.vue';
import CustomComponentExample from './vue/examples/CustomComponentExample.vue';
import DynamicForm from './vue/examples/DynamicForm.vue';
import DynamicFormExample from './vue/examples/DynamicFormExample.vue';
import LocalizationExample from './vue/examples/LocalizationExample.vue';
import ComponentBasedMessageExample from './vue/examples/ComponentBasedMessageExample.vue';
import FieldBasedMessageExample from './vue/examples/FieldBasedMessageExample.vue';

Vue.use(VueSimpleValidator);

Vue.component('LeftNavBar', LeftNavBar);
Vue.component('MainContent', MainContent);
Vue.component('DemoWithCode', DemoWithCode);

// chapters
Vue.component('GettingStarted', GettingStarted);
Vue.component('UsagesAndExamples', UsagesAndExamples);
Vue.component('Miscellaneous', Miscellaneous);
Vue.component('APIAndReference', APIAndReference);


// examples
Vue.component('BasicExample', BasicExample);
Vue.component('BuiltinRulesExample', BuiltinRulesExample);
Vue.component('CustomRuleExample', CustomRuleExample);
Vue.component('CrossFieldValidationExample1', CrossFieldValidationExample1);
Vue.component('CrossFieldValidationExample2', CrossFieldValidationExample2);
Vue.component('AsyncValidationExample1', AsyncValidationExample1);
Vue.component('AsyncValidationExample2', AsyncValidationExample2);
Vue.component('CheckboxGroup', CheckboxGroup);
Vue.component('CustomComponentExample', CustomComponentExample);
Vue.component('DynamicForm', DynamicForm);
Vue.component('DynamicFormExample', DynamicFormExample);
Vue.component('LocalizationExample', LocalizationExample);
Vue.component('ComponentBasedMessageExample', ComponentBasedMessageExample);
Vue.component('FieldBasedMessageExample', FieldBasedMessageExample);

new Vue({
  el: '#app',
  render: function (h) {
    return h(App);
  }
});

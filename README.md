
# NOTE FOR VUE3

Please use this fork if you are using vue3: [simple-vue3-validator](https://github.com/rak-phillip/simple-vue3-validator)

# Simple Vue Validator

Simple Vue validator is a lightweight yet flexible plugin for Vue.js 2.0 that allows you to validate input fields, and display errors. It watches changes of your model data, validates them and informs you with the validation result.

It supports the following features:
* Fully customized validation rules.
* Cross field validation.
* Async/ajax validation (with supports of loading indicator, result caching, debounced user input).
* Validating custom component.
* Dynamic form / multiple validation instances.

# Documentation

Please checkout the [full documentation](http://simple-vue-validator.magictek.cn) for more detail.

## Installation
Package is installable via npm.
```
npm install --save simple-vue-validator
```
You can also install it via bower.
```
bower install --save simple-vue-validator
```
NOTE: for bower package, please use /dist/plugin.js.

## Configuration
```
import Vue from 'vue';
import SimpleVueValidation from 'simple-vue-validator';
Vue.use(SimpleVueValidation);
```

## Basic Usage
Define the `validators` object in your vue / component instance:
```javascript
validators: {
      email: function (value) {
        return Validator.value(value).required().email();
      }
    }
```
In the template HTML use the `validation` object injected by the library to display validation status / results.
```html
<div class="message">{{ validation.firstError('email') }}</div>
```
Please checkout the [full documentation](http://simple-vue-validator.magictek.cn) for more detail.

## license MIT

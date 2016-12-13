<template>
  <div class="layout-content-block">
    <hr/>
    <div class="chapter-title">Getting Started</div>
    <hr/>
    <div id="introduction" class="section-title">Introduction</div>
    <div class="section-content">
      <p>
        <b>Simple Vue validator</b> is a lightweight yet flexible plugin for <a href="https://vuejs.org/">Vue.js</a> 2.0 that allows you to validate input fields, and display errors.
        It watches changes of your model data, validates them and informs you with the validation result.
      </p>
      <p>
        It uses a model-based solution for monitoring user input, this means all your validation rules can be put together in one place in javascript code,
        while the HTML template simply displays validation status and result, this IMO results in a better separation of business logic and presentation.
        Placing validation rules in code also means you can leverage the full power of javascript to implement complex logic.
      </p>
      <p>
        This plugin strives to achieve both simplicity and flexibility for form validation, basic validation should require only the minimal amount of codes, at the same time, it should also be able to support complex validation cases like:
      </p>
      <ul>
        <li>Fully customized validation rules.</li>
        <li>Cross field validation.</li>
        <li>Async/ajax validation (with supports of loading indicator, result caching, debounced user input).</li>
        <li>Validating custom component.</li>
        <li>Dynamic form / multiple validation instances.</li>
      </ul>
    </div>
    <div id="installation" class="section-title">Installation</div>
    <div class="section-content">
      Package is installable via npm.
      <pre><code class="language-dash">npm install --save simple-vue-validator</code></pre>
      You can also install it via bower.
      <pre><code class="language-dash">bower install --save simple-vue-validator</code></pre>
      <div class="note">
        For bower package, please use /dist/plugin.js
      </div>
    </div>
    <div id="configuration" class="section-title">Configuration</div>
    <div class="section-content">
      You can import the library and use as a Vue plugin to enable the functionality globally on all components containing validation configuration.
      <pre><code class="language-javascript">var Vue = require('vue');
var SimpleVueValidation = require('simple-vue-validator');
Vue.use(SimpleVueValidation);</code></pre>
      Alternatively it is possible to import a mixin directly to components in which it will be used.
      <pre><code class="language-javascript">var Component = Vue.extend({
  mixins: [require('simple-vue-validator').mixin],
  validators: { ... }
})</code></pre>
    </div>
    <div id="basic_example" class="section-title">Basic Example</div>
    <div class="section-content">
      First, you need to add the <span class="code">validators</span> object to your vue / component instance, defines your validation rules in the <span class="code">validators</span> object,
      then use the <span class="code">validation</span> object in template to display validation result. Finally, call <span class="code">this.$validate()</span> method for form submission.
      <DemoWithCode :components="'BasicExample'"/>
    </div>
    <div id="explanation" class="section-title">Explanation</div>
    <div class="section-sub-title">The validators object</div>
    <div class="section-content">
      The <span class="code">validators</span> object contains all the validation logic.
      <pre><code class="language-javascript">validators: {
  email: function(value) {
    return Validator.value(value).required().email();
  }
}</code></pre>
      <p>
        The key of validator denotes the <b>name</b> of field in vue model you want to observe and validate. <br/>
        In the above example, it's the <span class="code">email</span>,
        when validating nested fields you can use dot syntax for field name:
      </p>
      <pre><code class="language-javascript">{'person.email': ...}</code></pre>
      <p>
        In the case where multiple fields need to be watched and validated, e.g. <a href="#cross_field_validation"> Cross Field Validation</a>,
        the field names are separated by comma:
      </p>
      <pre><code class="language-javascript">{'password, confirmPassword': function(password, confirmPassword) {...}}</code></pre>
      <p>
        The validator itself is a function which takes the <b>value</b> of the field in vue model, executes validation logic and returns validation result. <br/>
        In the above example, the email value is first provided to the <span class="code">Validator</span> using the <span class="code">value()</span> function,
        then marked as required and validated against email format using <span class="code">required()</span> and <span class="code">email()</span> methods.
      </p>
      <pre><code class="language-javascript">function (value) {
  return Validator.value(value).required().email();
}</code></pre>
      <div class="note">
        Make sure to <b>return</b> the validation result to the validation framework, otherwise, the validation result will be ignored. <br/>
        Also, set field value with <span class="code">value()</span> method if you are using built-in validation rules like <span class="code">required()</span>, <span class="code">email()</span> or <span class="code">length()</span>.
        You can however omit this method call if you are using <a href="#custom_rule">Custom Rule</a>, because your custom function will validate the value directly.
      </div>
    </div>
    <div class="section-sub-title">The validation field</div>
    <div class="section-content">
      <p>
        The library expose a <span class="code">validation</span> field to your vue / component instance, in your template HTML,
        you use this field to display validation results:
      </p>
      <pre><code class="language-html" v-pre>&lt;div class=&quot;form-group&quot; :class=&quot;{error: validation.hasError('email')}&quot;&gt;</code></pre>
      <pre><code class="language-html" v-pre>&lt;div class=&quot;message&quot;&gt;{{ validation.firstError('email') }}&lt;/div&gt;</code></pre>
      <p>
        Checkout <a href="#r_validation_bag">ValidationBag API</a> for all the methods you can used to display validation related data.
      </p>
    </div>
    <div class="section-sub-title">The $validate() method</div>
    <div class="section-content">
      The library adds a <span class="code">$validate()</span> method to your vue instance,
      calling it triggers the validation of all fields. <br/>
      This method returns a promise which would resolve to true if validation successes.
      Using promise over boolean value allow the library to support <a href="#async_validation">Async Validation</a>.
    </div>
      <pre><code class="language-javascript">this.$validate()
  .then(function (success) {
    if (success) {
      alert('Validation succeeded!');
    }
  });</code></pre>
  </div>
</template>

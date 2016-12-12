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
      First, you need to add the <span class="code">validators</span> property to your Vue instance / component, defines your validation rules in the <span class="code">validators</span> property,
      then use the <span class="code">validation</span> object in template to display validation result. Finally, call <span class="code">this.$validate()</span> method for form submission.
    </div>

    <DemoWithCode :components="'BasicExample'"/>
  </div>
</template>
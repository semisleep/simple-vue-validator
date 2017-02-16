<template>
  <div class="layout-content-block">
    <hr/>
    <div class="chapter-title">Usages & Examples</div>
    <hr/>
    <div id="built_in_rules" class="section-title">Built-in Rules</div>
    <div class="section-content">
      <p>Here is an example form with different built-in rules:</p>
      <DemoWithCode :components="'BuiltinRulesExample'"/>
      <p>
        This example uses several built-in validation rules, such as
        <span class="code">required</span>, <span class="code">regex</span>, <span class="code">digit</span>,
        <span class="code">length</span>, <span class="code">integer</span> and <span class="code">greaterThan</span>,
        for the full list of built-in rules, check out the <a href="#r_validator">Validator / rules API</a>.
      </p>
      <div class="note">
        To reset the validation status, this example calls <span class="code">ValidationBag.reset()</span> method,
        for detail refer to <a href="#r_validation_bag">ValidationBag API</a>.
      </div>
    </div>
    <div id="custom_rule" class="section-title">Custom Rule</div>
    <div class="section-content">
      <DemoWithCode :components="'CustomRuleExample'"/>
      <p>
        Use <span class="code">Validator.custom()</span> method for custom validation rule,
        this method accepts a callback function to perform custom validation logic,
        the callback function is expected to return an error message (or promise, see <a href="#async_validation">Async Validation</a>) if validation fails.<br/>
        Optionally, you can provide the callback function's execution context object as the second parameter.
      </p>
      <p>
        In the above example, we are also using <span class="code">Validator.isEmpty()</span> method,
        this method is internally used by <span class="code">Validator.required()</span> method to determine if a field value is empty,
        since most validation rules apply only when the value is NOT empty, this method is also exposed as public API so that it can be used by custom code.
      </p>
    </div>
    <div id="cross_field_validation" class="section-title">Cross Field Validation</div>
    <div class="section-sub-title">Password validation</div>
    <div class="section-content">
      <DemoWithCode :components="'CrossFieldValidationExample1'"/>
      <p>
        In this example, the <span class="code">password</span> field has ordinary validation rule that it's required and its minimum length is 6. <br/>
        The <span class="code">repeat</span> field however, is much trickier.
        First of all, its value should match the <span class="code">password</span> field, this means <b>cross field validation</b>.
        Secondary, when the form is not already submitted, it should not be validated if user haven't touched it,
        otherwise we will see validation error message for <span class="code">repeat</span> field when user is just typing in <span class="code">password</span> field but haven't touch the <span class="code">repeat</span> field yet!<br/>
        Let's take a look at the code:
      </p>
      <pre><code class="language-javascript">submit: function () {
  this.submitted = true;
  ...
}</code></pre>
      <p>
        We set the <span class="code">submitted</span> field to true when user clicks the submit button.
      </p>
      <pre><code class="language-javascript">'repeat, password': function (repeat, password) {
  if (this.submitted || this.validation.isTouched('repeat')) {
    return Validator.value(repeat).required().match(password);
  }
}</code></pre>
      <p>
        In the validators config, we use <span class="code">'repeat, password'</span> as key, so that the library would watch these 2 fields for us,
        note that now we expect the library to provide values of both <span class="code">repeat</span> and <span class="code">password</span> in the validator function. <br/>
        In the code, we only perform validation when the form is already submitted or the <span class="code">repeat</span> field is already touched by user.
        We also enforce that the value of <span class="code">repeat</span> field should match the value of <span class="code">password</span> field.
      </p>
      <div class="note">
        We use <span class="code">ValidationBag.isTouch()</span> method to detect if a field is touched by user,
        check out <a href="#r_validation_bag">ValidationBag API</a> to find more details about this method and other similar utility methods.
      </div>
    </div>
    <div class="section-sub-title">Conditional validation</div>
    <div class="section-content">
      <DemoWithCode :components="'CrossFieldValidationExample2'"/>
      <p>
        This example demonstration the conditional validation use case,
        where the <span class="code">other</span> field is only required when user selects the "Other fruit (please specify)" option. <br/>
        Like the previous example, we set a <span class="code">submitted</span> field after user submitted,
        we watch both <span class="code">other</span> and <span class="code">fruit</span> field,
        and only perform validation when the form is submitted or <span class="code">other</span> field is touched.<br/>
        There are also some differences. First, we use <span class="code">v-if="fruit === 'other'"</span> to make the text field visible only when "Other fruit (please specify)" option is selected.
        Secondary, we skip the validation if the value of <span class="code">fruit !== 'other'</span>.
      </p>
      <div class="note">
        Note that the library would use the <b>first</b> property name as error field name, which is <span class="code">'other'</span>,
        thus we use use it as opposed to <span class="code">'fruit'</span> when checking for error to display: <span class="code">validation.hasError('other')</span>.
      </div>
    </div>
    <div id="async_validation" class="section-title">Async Validation</div>
    <div class="section-sub-title">Basic</div>
    <div class="section-content">
      <DemoWithCode :components="'AsyncValidationExample1'"/>
      <p>
        Async validation is also supported by the <span class="code">Validator.custom()</span> method,
        comparing to <a href="#custom_rule">Custom Rule</a>, the difference is that instead of returning the error message directly,
        the callback function now returns a promise, the promise should resolve to error message if validation fails.
      </p>
      <pre><code class="language-javascript">return Validator.custom(function () {
  if (!Validator.isEmpty(value)) {
    return Promise.delay(1000)
      .then(function() {
        if (value !== 'vuejs.org') {
          return 'Already taken!';
        }
      });
  }
});</code></pre>
      <p>
        Here we simply delay the execution for 1 second, in the real world, you probably will make an ajax request to server.
      </p>
      <div class="note">
        In this example, we are using <a href="http://bluebirdjs.com">Blue Bird</a> for promise,
        but you can use which ever promise library you prefer.
      </div>
      <pre><code class="language-javascript">&lt;i v-if=&quot;validation.isValidating('domain')&quot; class=&quot;fa fa-spin fa-spinner&quot;&gt;&lt;/i&gt;
&lt;i v-if=&quot;domain &amp;&amp; validation.isPassed('domain')&quot; class=&quot;text-success fa fa-check-circle&quot;&gt;&lt;/i&gt;</code></pre>
      <p>
        In the template HTML, we use <span class="code">ValidationBag.isValidating()</span> to show an animating spinner when async validation is in progress,
        we also use <span class="code">ValidationBag.isPassed()</span> to show a green tick when validation successes.
      </p>
    </div>
    <div class="section-sub-title">Dedouncing & caching</div>
    <div class="section-content">
      <p>
        You might notice 2 problems in previous example:
      </p>
      <ul>
        <li>The async validation is invoked again when you clicks submit, this is not necessary.</li>
        <li>The async validation is activated every time user hits the keyboard, this would cause performance issue if we are making ajax request.</li>
      </ul>
      <DemoWithCode :components="'AsyncValidationExample2'"/>
      <p>
        To tackle the first problem, we use the <span class="code">cache</span> option and set it to true,
        to tell the library we would like to cache all previous results. <br/>
        For the second problem, we set the <span class="code">debounce</span> option to half a second,
        so that the async validation is postponed until user stops typing for half a second. <br/>
        Lastly, the validator function is now specified via the <span class="code">validator</span> option.
      </p>
      <div class="note">
        The <span class="code">cache</span> option can also take a <span class="code">'all'</span> string, which is equivalent to <span class="code">true</span>,
        also the <span class="code">'last'</span> string would tell to framework to only cache the last result,
        this is useful when you only want to enable caching for form submission.
      </div>
    </div>
    <div id="custom_component" class="section-title">Custom Component</div>
    <div class="section-content">
      <DemoWithCode :components="['CustomComponentExample', 'CheckboxGroup']"/>
      <p>
        The library can work with any custom component as long as the component supports <span class="code">v-model</span>.
        The above example demonstrates using a custom <span class="code">CheckboxGroup</span> component that wraps the <a href="http://icheck.fronteed.com/">iCheck</a> library.
      </p>
    </div>
    <div id="dynamic_form" class="section-title">Dynamic Form</div>
    <div class="section-content">
      <DemoWithCode :components="['DynamicFormExample', 'DynamicForm']"/>
      <p>
        To implement dynamic form (form created at runtime), move the form related HTML and codes into a separated child component and expose a validate method,
        this would result in multiple <a href="#r_validation_bag">ValidationBag</a> instances attached to the child components.<br/>
        You can then invoke the validate method from parent to trigger validation logic.
      </p>
    </div>
    <div id="custom_error_message" class="section-title">Custom Error Message / Localization</div>
    <div class="section-content">
      <div class="note">
        Starting from 0.13.0, the error message templates is updated to use the same message key as rule name,
        if you were using version lower than 0.13.0 and have defined your customized templates,
        you will have to update your templates according to the changes <a target="_blank" href="https://github.com/semisleep/simple-vue-validator/commit/500402134346b8a014cc961b55dc1bd2189f59fb#diff-8f4411d1af5a3b8a78502627925694d8">here</a>.
      </div>
    </div>
    <div id="global_error_message" class="section-sub-title">Overriding Global Error Message</div>
    <div class="section-content">
      <DemoWithCode :components="'LocalizationExample'"/>
      <p>
        Use <span class="code">SimpleVueValidator.extendTemplates()</span> method (or <span class="code">Vue.use(SimpleVueValidator, {templates: {...})</span>) to override the default error messages.
        This can also be used to provide localized messages to the library.
      </p>
      <div class="note">
        See <a target="_blank" href="https://github.com/semisleep/simple-vue-validator/blob/master/src/templates.js">templates.js</a> for all the text templates you can replace.
      </div>
    </div>
    <div id="component_based_error_message" class="section-sub-title">Component Based Error Message</div>
    <div class="section-content">
      <DemoWithCode :components="'ComponentBasedMessageExample'"/>
      <p>
        Use <span class="code">Validator.create({templates: ...})</span> to create a new <span class="code">Validator</span> with customized error messages.
        Overriding the error messages template this way will have the scope limit to the newly created <span class="code">Validator</span>, so it won't affect
        the global settings.
      </p>
    </div>
    <div id="field_based_error_message" class="section-sub-title">Field Based Error Message</div>
    <div class="section-content">
      <DemoWithCode :components="'FieldBasedMessageExample'"/>
      <p>
        For all the built-in rules, you can pass a custom message as the last argument to specify the error message for the current field only.
      </p>
    </div>
  </div>
</template>
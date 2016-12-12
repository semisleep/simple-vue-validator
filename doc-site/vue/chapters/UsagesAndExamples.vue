<template>
  <div class="layout-content-block">
    <hr/>
    <div class="chapter-title">Usages & Examples</div>
    <hr/>
    <div class="section-title">Built-in Rules</div>
    <div class="section-content">
      <p>Here is an example form with different built-in rules:</p>
      <DemoWithCode :components="'BuiltinRulesExample'"/>
      <p>
        This example uses several built-in validation rules, such as
        <span class="code">required</span>, <span class="code">regex</span>, <span class="code">digit</span>,
        <span class="code">length</span>, <span class="code">integer</span> and <span class="code">greaterThan</span>,
        for the full list of built-in rules, check out the <a href="#r_rules">rules API</a>.
      </p>
      <p>
        To reset the validation status, this example calls <span class="code">ValidationBag.reset()</span> method,
        for detail refer to <a href="#r_validation_bag">ValidationBag API</a>.
      </p>
    </div>
    <div class="section-title">Customized Rule</div>
    <div class="section-content">
      <DemoWithCode :components="'CustomRuleExample'"/>
      <p>
        Use <span class="code">Validator.custom()</span> method for custom validation rule,
        this method accepts a callback function to perform custom validation logic,
        the callback function is expected to return an error message (or promise, see <a href="#async_valiation">Async Validation</a>) if validation fails.<br/>
        Optionally, you can provide the callback function's execution context object as the second parameter.
      </p>
      <p>
        In the above example, we are also using <span class="code">Validator.isEmpty()</span> method,
        this method is internally used by <span class="code">Validator.required()</span> method to determine if a field value is empty,
        since most validation rules apply only when the value is NOT empty, this method is also exposed as public API so that it can be used by custom code.
      </p>
    </div>
    <div class="section-title">Cross Field Validation</div>
    <div class="section-sub-title">Password validation</div>
    <div class="section-content">
      <DemoWithCode :components="'CrossFieldValidationExample1'"/>
      <p>
        In this example, the <span class="code">password</span> field has ordinary validation rule that it's required and its minimum length is 6. <br/>
        The <span class="code">repeat</span> field however, is much trickier.
        First of all, its value should match the <span class="code">password</span> field, this means <b>cross field validation</b>.
        Secondary, when the form is not already submitted, it should not be validated if user haven't touched it,
        otherwise we will see validation error message for <span class="code">repeat</span> field when user is typing in <span class="code">password</span> field for the first time!<br/>
        Let take a look at the code:
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
        We also enforce that the value of <span class="code">repeat</span> field should math the value of <span class="code">password</span> field.
      </p>
      <p>
        We use <span class="code">Validation.isTouch()</span> method to detect if a field is touched by user,
        check out <a href="#r_validation_bag">ValidationBag API</a> to find more details about this method and other similar utility methods.
      </p>
    </div>
    <div class="section-sub-title">Conditional validation</div>
    <div class="section-content">
      <DemoWithCode :components="'CrossFieldValidationExample2'"/>
      <p>
        This example demonstration the conditional validation use case,
        where the <span class="code">other</span> field is only required when user selects the <span class="code">other fruit</span> option. <br/>
        Like the previous example, we set a <span class="code">submitted</span> field after user submitted,
        we watch both <span class="code">fruit</span> and <span class="code">other</span> field,
        and only perform validation when the form is submitted or <span class="code">other</span> field is touched.<br/>
        There are also some differences. First, we use <span class="code">v-if="fruit === 'other'"</span> to make the text field visible when <span class="code">other fruit</span> option is selected.
        Secondary, we skip the validation if the value of <span class="code">fruit</span> is not <span class="code">'other'</span>.
      </p>
      <div class="note">
        Note that we called <span class="code">Validator.field('otherFruit')</span> to set the error field name,
        because we used <span class="code">'fruit, other'</span> as validator key,
        and the library by default would use the <b>first</b> property name as error field name,
        which is <span class="code">'fruit'</span>, but it would be confusing as we are putting related error message around the <span class="code">other</span> field,
        as such, we renamed the error field name to <span class="code">'otherFruit'</span>.
      </div>
    </div>
    <div class="section-title">Async Validation</div>
    <div class="section-content">
      <p>TODO</p>
    </div>
    <div class="section-title">Custom Component</div>
    <div class="section-content">
      <p>TODO</p>
    </div>
    <div class="section-title">Dynamic Form</div>
    <div class="section-content">
      <p>TODO</p>
    </div>
  </div>
</template>
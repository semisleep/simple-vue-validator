<template>
  <div class="layout-content-block">
    <hr/>
    <div class="chapter-title">API</div>
    <hr/>
    <div id="r_install" class="section-title">install()</div>
    <div class="section-content">
      <p>
        Installing the library is the same as other Vue plugins,
        in addition, you can provide the <span class="code">templates</span> option to provide localized error messages,
        and the <span class="code">Promise</span> option to specify the promise library to use by <span class="code">$validate()</span> method.
      <pre><code class="language-javascript">Vue.use(SimpleVueValidator, {templates: {...}, Promise: require('bluebird');</code></pre>
      </p>
      <p>
        You can also use <span class="code">SimpleVueValidator.mixin</span> if you don't won't to register SimpleVueValidator globally,
        refer to the <a href="#configuration">Configuration</a> section.
      </p>
    </div>
    <div id="r_validators" class="section-title">validators object</div>
    <div class="section-content">
      <p>
        The <span class="code">validators</span> object placed in your vue / component definition contains all the validation logic.
      </p>
      <pre><code class="language-javascript">validators: {
  email: function(value) {
    return Validator.value(value).required().email();
  }
}</code></pre>
      <p>
        The key of validator denotes the <b>name</b> of field in Vue model you want to observe and validate.<br/>
        When validated nested field, use dot syntax to write the field name.<br/>
        The key can also be a list of names separated by comma, which makes the library to watch multiple fields and provide multiple values to your validator function.
        Note that in case of multiple names, the first name is used as the error field name.
      </p>
      <pre><code class="language-javascript">validators: {
  email: function(value) {...},
  'person.name': function(value) {...},
  'password, repeat': function(passwordValue, repeatValue) {...},
}</code></pre>
      <p>
        The validator function should take the field value(s) as parameter(s),
        call <a href="#r_validator">Validator</a>'s methods to set validation rule,
        and finally and <b>return</b> it to the library.
      </p>
      <p>
        Additionally, you can pass the <span class="code">cache</span> and <span class="code">debounce</span> options to further control the validator's behavior.
      </p>
      <pre><code class="language-javascript">validators: {
  'email': {
    cache: true, // or 'all', 'last'
    debounce: 500, // in milliseconds
    validator: function(value) {...},
  }
}</code></pre>
      <p>
        The <span class="code">cache</span> option is useful for <a href="#async_validation">async validation</a>
        that the validation results for the same field values are cached.<br/>
        Beside setting it to <span class="code">true</span>,
        you can also set it to <span class="code">'all'</span> which has the same effect as <span class="code">true</span>,
        or <span class="code">'last'</span> which will only cache the last validation result, it's useful
        if you only want to prevent duplicate async validation in form submission.
      </p>
      <p>
        The <span class="code">debounce</span> option can be set with a number which is the millisecond to wait before user stops typing,
        it's useful for saving ajax call so that it won't impact server performance.
      </p>
    </div>
    <div id="r_plugin" class="section-title">Plugin</div>
    <div class="section-content">
      <p>
        The <span class="code">SimpleVueValidator</span> plugin expose the following fields and methods:
      </p>
      <div class="table-wrapper">
        <table>
          <thead>
          <tr>
            <th>Field /Method</th>
            <th>Params</th>
            <th>Return</th>
            <th>Description</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Validator</td>
            <td>none</td>
            <td>the Validator class</td>
            <td>See <a href="#r_validator">Validator / rules</a></td>
          </tr>
          <tr>
            <td>mixin</td>
            <td>none</td>
            <td>the mixin</td>
            <td>See <a href="#configuration">Configuration</a></td>
          </tr>
          <tr>
            <td>install</td>
            <td>{Object options}</td>
            <td>undefined</td>
            <td>
              This method is expected to be called by Vue.js when the plugin is registered by <span class="code">Vue.use(SimpleVueValidator)</span>
            </td>
          </tr>
          <tr>
            <td>extendTemplates</td>
            <td>{Object template}</td>
            <td>undefined</td>
            <td>
              Extend the built-in error text template, this method is mainly used for localization.<br/>
              See <a href="https://github.com/semisleep/simple-vue-validator/blob/master/src/templates.js">templates.js</a> for all the text templates you can replace.
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="r_validator" class="section-title">Validator / rules</div>
    <div class="section-content">
      <p>
        The <span class="code">Validator</span> class provides the entry point for setting validation rule,
        it has the following methods:
      </p>
      <div class="table-wrapper">
        <table>
          <thead>
          <tr>
            <th>Method</th>
            <th>Params</th>
            <th>Return</th>
            <th>Description</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>create</td>
            <td>{Object options}</td>
            <td>the customized <span class="code">Validator</span></td>
            <td>
              Creates a customized <span class="code">Validator</span> via given options.<br/>
              Set <span class="code">options.templates</span> for <a href="#component_based_error_message">component based error message</a>.
            </td>
          </tr>
          <tr>
            <td>value</td>
            <td>{String value}</td>
            <td>the rule</td>
            <td>Sets the value which will be used by all built-in rules.</td>
          </tr>
          <tr>
            <td>required</td>
            <td>none</td>
            <td>the rule</td>
            <td>Checks that field value is not null / empty.</td>
          </tr>
          <tr>
            <td>float</td>
            <td>none</td>
            <td>the rule</td>
            <td>Checks that field value is a float number.</td>
          </tr>
          <tr>
            <td>integer</td>
            <td>none</td>
            <td>the rule</td>
            <td>Checks that the field value is an integer.</td>
          </tr>
          <tr>
            <td>lessThan</td>
            <td>{Number num}</td>
            <td>the rule</td>
            <td>Checks that the field value is less than given num.</td>
          </tr>
          <tr>
            <td>lessThanOrEqualTo</td>
            <td>{Number num}</td>
            <td>the rule</td>
            <td>Checks that the field value is less than or equal to given num.</td>
          </tr>
          <tr>
            <td>greaterThan</td>
            <td>{Number num}</td>
            <td>the rule</td>
            <td>Checks that the field value is greater than given num.</td>
          </tr>
          <tr>
            <td>greaterThanOrEqualTo</td>
            <td>{Number num}</td>
            <td>the rule</td>
            <td>Checks that the field value is greater than or equal to given num.</td>
          </tr>
          <tr>
            <td>between</td>
            <td>{Number low}<br/>{Number high}</td>
            <td>the rule</td>
            <td>Checks that the field value is between given bounds (inclusive).</td>
          </tr>
          <tr>
            <td>size</td>
            <td>{Number num}</td>
            <td>the rule</td>
            <td>Checks that if the field value is an array like object, its size is the same as given num.</td>
          </tr>
          <tr>
            <td>length</td>
            <td>{Number num}</td>
            <td>the rule</td>
            <td>Checks that the field value's string length equals to given num.</td>
          </tr>
          <tr>
            <td>minLength</td>
            <td>{Number num}</td>
            <td>the rule</td>
            <td>Checks that the field value's string length is greater or equals to given num.</td>
          </tr>
          <tr>
            <td>maxLength</td>
            <td>{Number num}</td>
            <td>the rule</td>
            <td>Checks that the field value's string length is less or equals to given num.</td>
          </tr>
          <tr>
            <td>lengthBetween</td>
            <td>{Number low}<br/>{Number high}</td>
            <td>the rule</td>
            <td>Checks that the field value's string length between given bounds (inclusive).</td>
          </tr>
          <tr>
            <td>in</td>
            <td>{Array options}</td>
            <td>the rule</td>
            <td>Checks that the field value is in given options.</td>
          </tr>
          <tr>
            <td>notIn</td>
            <td>{Array options}</td>
            <td>the rule</td>
            <td>Checks that the field value is not in given options.</td>
          </tr>
          <tr>
            <td>regex</td>
            <td>{RegExp|String pattern}<br/>{String message?}</td>
            <td>the rule</td>
            <td>Checks that the field value matches given pattern, optionally use given message as error message if provided.</td>
          </tr>
          <tr>
            <td>digit</td>
            <td>none</td>
            <td>the rule</td>
            <td>Checks that the field value contains only digit characters.</td>
          </tr>
          <tr>
            <td>email</td>
            <td>none</td>
            <td>the rule</td>
            <td>Checks that the field value is a valid e-mail.</td>
          </tr>
          <tr>
            <td>url</td>
            <td>none</td>
            <td>the rule</td>
            <td>Checks that the field value is a valid url.</td>
          </tr>
          <tr>
            <td>custom</td>
            <td>{Function callback}<br/>{Object context?}</td>
            <td>the rule</td>
            <td>
              Execute custom validation logic in provide callback function, optional use given context for callback function invocation.<br/>
              The callback function is expected to return the error message if validation fails.<br/>
              Or in the case of async validation, the callback function can return a promise which would resolves to error message if validation fails.
            </td>
          </tr>
          <tr>
            <td>isEmpty</td>
            <td>{Object value}</td>
            <td>Boolean</td>
            <td>
              A utility method that check if given value is null / undefined / empty string (after trim) or empty array,
              it's used by required() method internally, and also exposed so to be utilized by custom code.
            </td>
          </tr>
          <tr>
            <td>format</td>
            <td>{String template}<br/>{String... args}</td>
            <td>String</td>
            <td>
              A utility method to format given args using given template.
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="r_validation_bag" class="section-title">ValidationBag</div>
    <div class="section-content">
      <p>
        when you provides the <a href="#r_validators">validators object</a> to your vue / component instance,
        the library adds a <span class="code">ValidationBag</span> instance named <b>validation</b> to your vue / component instance.
        It contains various methods for you to display validation status / result in your template HTML.
      </p>
      <div class="table-wrapper">
        <table>
          <thead>
          <tr>
            <th>Method</th>
            <th>Params</th>
            <th>Return</th>
            <th>Description</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>hasError</td>
            <td>{String field?}</td>
            <td>Boolean</td>
            <td>Returns if there's any error related to given field (or the whole validation instance if field is not provide).</td>
          </tr>
          <tr>
            <td>firstError</td>
            <td>{String field?}</td>
            <td>String</td>
            <td>Returns the first error related to given field (or the whole validation instance if field is not provide).</td>
          </tr>
          <tr>
            <td>allErrors</td>
            <td>{String field?}</td>
            <td>Array</td>
            <td>Returns all the errors related to given field (or the whole validation instance if field is not provide).</td>
          </tr>
          <tr>
            <td>countErrors</td>
            <td>{String field?}</td>
            <td>Array</td>
            <td>Returns the count of errors related to given field (or the whole validation instance if field is not provide).</td>
          </tr>
          <tr>
            <td>isValidating</td>
            <td>{String field?}</td>
            <td>Boolean</td>
            <td>
              Returns if the library is validating (<a href="#async_validation">async validation</a>) given field
              (or if there's any field in the validation instance being validating).
            </td>
          </tr>
          <tr>
            <td>isPassed</td>
            <td>{String field}</td>
            <td>Boolean</td>
            <td>
              Returns if given field has passed the validation.
            </td>
          </tr>
          <tr>
            <td>isTouched</td>
            <td>{String field}</td>
            <td>Boolean</td>
            <td>
              Returns if given field has been touched by user.
            </td>
          </tr>
          <tr>
            <td>reset</td>
            <td>none</td>
            <td>undefined</td>
            <td>
              Resets all the validation status / results.
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div id="r_validate" class="section-title">$validate()</div>
    <div class="section-content">
      <p>
        when you provides the <a href="#r_validators">validators object</a> to your vue / component instance,
        the library adds a <span class="code">$validate()</span> method to your vue / component instance.
      </p>
      <p>
        Calling <span class="code">$validate()</span> method would execute all the validators,
        and returns a promise which would resolve to true if validation successes.
      </p>
      <p>
        In case you only want to validate some specific fields rather than all fields defined by in the <span class="code">validators</span>,
        you can pass either the field name or an array of field names to the <span class="code">$validate()</span> method.
      </p>
    </div>
  </div>
</template>
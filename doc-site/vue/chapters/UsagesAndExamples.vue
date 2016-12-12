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
        for detail refer to <a href="#r_validation_bag">validation bag API</a>.
      </p>
    </div>
    <div class="section-title">Customized Rule</div>
    <div class="section-content">
      <p>TODO</p>
    </div>
    <div class="section-title">Cross Field Validation</div>
    <div class="section-content">
      <p>TODO</p>
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
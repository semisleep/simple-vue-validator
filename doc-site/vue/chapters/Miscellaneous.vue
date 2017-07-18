<template>
  <div class="layout-content-block">
    <hr/>
    <div class="chapter-title">Miscellaneous</div>
    <hr/>
    <div id="m_modes" class="section-title">Interaction Modes</div>
    <div class="section-content">
      <p>
        There a 3 difference modes concerning how validation would interact with user input:
      </p>
      <ul>
        <li>
          The default mode is <span class="code">interactive</span>, in this mode, the library will actively update validation result when user makes changes
          to the form. Normally the validation happens immediately when user is typing, but this can be delayed if <span class="code">v-model.lazy</span> is used.
        </li>
        <li>
          The second mode is <span class="code">manual</span>, in this mode, the validation is triggered only when <span class="code">$validate()</span>
          method is explicitly called.
        </li>
        <li>
          The last mode is <span class="code">conservative</span>, in this mode, the validation is passive at first, just the same as
          <span class="code">manual</span> mode. But once the <span class="code">$validate()</span> method is called, it becomes active and acts exactly like
          <span class="code">interactive</span> mode.
        </li>
      </ul>
      <p>
        Use any of the following approach to set the interaction mode:
      </p>
      <pre><code class="language-javascript">Vue.use(SimpleVueValidator, {mode: 'manual'};</code></pre>
      <p>
        Or
      </p>
      <pre><code class="language-javascript">SimpleVueValidator.setMode('conservative');</code></pre>
    </div>
  </div>
</template>
<template>
  <div class="layout-content-block">
    <div class="chapter-title">Getting Started</div>
    <hr/>
    <div class="section-title">Package content</div>
    <div class="section-content">
      Simple, lightweight model-based validation for Vue.js
      You can read the introduction post for more insight on how this solution differs from other validation libraries.
    </div>
    <div class="section-title">Installation</div>
    <div class="section-content">
      Package is installable via npm.
      <pre><code class="language-dash">npm install --save simple-vue-validator</code></pre>
      <pre id="testMessage"><code class="language-javascript">{{message}}</code></pre>
    </div>
    <div class="tab-container">
      <a href="javascript:void(0)" class="tab active"><span class="hidden-mobile"><i class="fa fa-play"></i>&nbsp;&nbsp;&nbsp;&nbsp;</span>DEMO</a>
      <a href="javascript:void(0)" class="tab"><span class="hidden-mobile"><i class="fa fa-html5"></i>&nbsp;&nbsp;&nbsp;&nbsp;</span>HTML</a>
      <a href="javascript:void(0)" class="tab"><span class="hidden-mobile"><i class="fa fa-code"></i>&nbsp;&nbsp;&nbsp;&nbsp;</span>Javascript</a>
    </div>
    <div class="page-container">
      <div class="page active">
        <BasicExample />
      </div>
      <div class="page">
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  module.exports = {
    name: 'GettingStarted',
    data: function () {
      return {
        message: 'alert(\'test\');'
      };
    },
    created: function () {
      /*
      window.setTimeout(function () {
        this.message = 'for (var i = 0; i < 10; i++) { console.log(i); }';
        this.$nextTick(function () {
          require('prismjs').highlightElement(this.$el.querySelector("#testMessage"));
        }.bind(this));
      }.bind(this), 2000);
      */
    }
  }
</script>
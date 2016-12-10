<template>
  <div class="layout-form">
    <div class="form-group">
      <div class="label">Name</div>
      <div class="content"><input class="form-control" /></div>
      <div class="message"></div>
    </div>
    <div class="form-group error">
      <div class="label">Email</div>
      <div class="content"><input class="form-control" /></div>
      <div class="message">Required.</div>
    </div>
    <div class="form-group">
      <div class="label"></div>
      <div class="content text-right"><button type="button">Try It</button></div>
    </div>
  </div>
</template>

<script type="text/javascript">
  module.exports = {
    name: 'BasicExample',
    data: function () {
      return {
        message: 'alert(\'test\');'
      };
    }
  }
</script>
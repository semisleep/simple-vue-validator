<template>
  <div>
    <LeftNavBar />
    <MainContent />
  </div>
</template>

<script type="text/javascript">
  'use strict';

  module.exports = {
    name: 'App',
    components: {
      'LeftNavBar': require('./LeftNavBar.vue'),
      'MainContent': require('./MainContent.vue')
    }
  }
</script>

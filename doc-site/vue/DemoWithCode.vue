<template>
  <div class="layout-demo">
    <div class="tab-container">
      <a v-for="(tab, index) in tabs" class="tab" :class="{active: tab.active, demo: tab.type === 'demo'}" @click="select(index)" href="javascript:void(0)">
        <span class="hidden-mobile"><i class="fa" :class="tab.iconClass"></i>&nbsp;&nbsp;&nbsp;&nbsp;</span>
        {{ tab.name }}
      </a>
    </div>
    <div class="page-container">
      <div v-for="page in pages" class="page" :class="{active: page.active, demo: page.type === 'demo'}">
        <template v-if="page.type === 'demo'">
          <component v-bind:is="page.component"/>
        </template>
        <template v-else-if="page.type === 'code'">
          <template v-if="page.code">
            <pre><code :class="'language-' + page.language">{{page.code}}</code></pre>
          </template>
          <template v-else>
            <div class="indicator">
              <i v-if="!page.error" class="fa fa-spin fa-spinner"></i>
              <i v-else class="fa fa-exclamation-triangle"></i>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  var _ = require('lodash');
  var Promise = require('bluebird');
  var $ = require('jquery');
  require('waypoints/lib/jquery.waypoints');
  var prism = require('prismjs');

  function getVueFile(component) {
    var url = 'vue/examples/' + component + '.vue';

    console.log('Getting vue file: ' + url);

    return Promise
      .resolve($.ajax({
        type: "get",
        url: url,
        datatype: "text"
      }))
      .then(function (text) {
        var html = text.substring(text.indexOf('<template>') + '<template>'.length, text.lastIndexOf('</template>'));
        var javascript = text.substring(text.indexOf('>', text.indexOf('<script')) + '>'.length, text.lastIndexOf('<\/script>'));
        html = formatText(html);
        javascript = formatText(javascript.replace('../../../src/', 'simple-vue-validator'));
        return {
          html: html,
          javascript: javascript
        }
      })
  }

  function formatText(text) {
    if (text[0] === '\n') {
      text = text.substring(1);
    }
    return text;
  }

  var offsets = ['90%', '80%', '70%', '60%', '20%', '10%'];

  function addWaypoint(element, handler) {
    var waypoints = [];
    offsets.forEach(function (offset) {
      waypoints.push($(element).waypoint({
        handler: function () {
          waypoints.forEach(function (waypoint) {
            waypoint.destroy();
          });
          handler();
        },
        offset: offset
      }));
      waypoints = _.flatten(waypoints); // jquery plugin version of waypoint returns an array!
    });
  }

  module.exports = {
    name: 'DemoWithCode',
    props: ['components'],
    data: function () {
      var data = {
        theComponents: _.isArray(this.components) ? this.components : [this.components],
        tabs: [],
        pages: [],
        loaded: false
      };
      var multi = data.theComponents.length > 1;
      data.theComponents.forEach(function (component, index) {
        if (index === 0) {
          // only demo the first component
          data.tabs.push({type: 'demo', active: true, name: 'DEMO', iconClass: 'fa-play'});
          data.pages.push({type: 'demo', active: true, component: component})
        }
        // html and js codes
        data.tabs.push({type: 'code', active: false, name: multi ? component + '.js' : 'JavaScript', iconClass: 'fa-code'});
        data.tabs.push({type: 'code', active: false, name: multi ? component + '.html' : 'HTML', iconClass: 'fa-html5'});
        data.pages.push({type: 'code', active: false, component: component, code: null, language: 'javascript', error: false});
        data.pages.push({type: 'code', active: false, component: component, code: null, language: 'html', error: false});
      });
      return data;
    },
    mounted: function () {
      addWaypoint(this.$el, function() {
        this.load();
      }.bind(this));
    },
    methods: {
      select: function (index) {
        if (!this.tabs[index].active) {
          this.tabs.forEach(function (tab, tabIndex) {
            tab.active = tabIndex === index;
          });
          this.pages.forEach(function (page, pageIndex) {
            page.active = pageIndex === index;
          });
        }
      },
      load: function () {
        if (this.loaded) {
          return;
        }
        this.loaded = true;

        var requests = this.theComponents.map(function (component) {
          return getVueFile(component)
            .bind(this)
            .then(function (result) {
              this.pages.forEach(function (page) {
                if (page.type === 'code' && page.component === component) {
                  if (page.language === 'html') {
                    page.code = result.html;
                  } else if (page.language === 'javascript') {
                    page.code = result.javascript;
                  }
                }
              }, this);
            })
            .catch(function (e) {
              console.error(e);
              this.pages.forEach(function (page) {
                if (page.type === 'code' && page.component === component) {
                  page.error = true;
                }
              }, this);
            });
        }, this);

        Promise
          .all(requests)
          .bind(this)
          .then(function () {
            this.$nextTick(function () {
              $(this.$el).find('pre code').each(function(index, pre) {
                prism.highlightElement(pre);
              });
            }.bind(this));
          });
      }
    }
  }
</script>
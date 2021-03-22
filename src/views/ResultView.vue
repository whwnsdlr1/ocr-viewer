<template>
<div class="result-view">
  <div style="flex:0 0 10px;"/>
  <div class="header">
    <div class="row1">
      <h3>Text</h3>
    </div>
  </div>
  <div class="w-search">
    <md-field md-inline>
      <md-icon>search</md-icon>
      <label>search...</label>
      <md-input @input="listen__search__oninput" />
    </md-field>
  </div>
  <div style="flex:0 0 5px;"/>
  <!--<div class="text-area" style="flex:1 0 0;">-->
  <transition-group
    name="staggered-fade"
    tag="div"
    class="text-area"
    style="flex:1 0 0;"
    v-bind:css="true"
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <BadgeText v-for="text in searchTexts" :data="text" :key="text.id" @ontoggle="listen__badge__ontoggle" />
  </transition-group>
  <!--</div>-->
</div>
</template>

<script>
import BadgeText from '@/components/BadgeText.vue'
import _ from 'lodash'
import Velocity from 'velocity-animate'

export default {
  components: {
    BadgeText
  },
  data: function () {
    return {
      state: {
        searchText: null,
        activeIds: []
      },
      debouncedInput: '',
      timeout: null
    }
  },
  methods: {
    listen__search__oninput: _.debounce(function (e) {
      this.state.searchText = e;
    }, 300),
    listen__badge__ontoggle: function (e) {
      for (let item of this.searchTexts) {
        if (item.id == e.id) {
          item.highlight = !item.highlight;
          this.$store.commit('frameDataPred', {id: item.id, key: 'highlight', value: item.highlight});
        }
      }
      this.$store.commit('updateTagging');
    },
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1 },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0 },
          { complete: done }
        )
      }, delay)
    }
  },
  computed: {
    texts: function () {
      return this.$store.state.frameData.pred;
    },
    searchTexts: function () {
      if (this.texts.length == 0)
        return [];
      if (this.state.searchText == null || this.state.searchText.length == 0) {
        return this.texts.slice();
      } else {
        let searchTexts = [];
        for (let item of this.texts) {
          if (item.text.indexOf(this.state.searchText) != -1)
            searchTexts.push(item);
        }
        return searchTexts;
      }
    }
  },
  watch: {
    searchTexts: function () {
      for (let item of this.texts) {
        const idx = this.searchTexts.findIndex((v) => item.id == v.id);
        if (idx != -1) {
          this.$store.commit('frameDataPred', {id: item.id, key: 'active', value: true});
          this.$store.commit('frameDataPred', {id: item.id, key: 'highlight', value: this.searchTexts[idx].highlight});
        }
        else {
          this.$store.commit('frameDataPred', {id: item.id, key: 'active', value: false});
          this.$store.commit('frameDataPred', {id: item.id, key: 'highlight', value: false});
        }
      }
      this.$store.commit('updateTagging');
    }
  }
}
</script>

<style scoped>
.result-view {
   display:flex;
   flex-direction:column;
   background:#FFFFFF;
   padding:0px 10px;
   border-left:1px solid #aaaaaa
}
.header {
  flex:0 0 27px;
  display:flex;
  flex-direction:column;
  padding:0px 0px 3px 0px;
  border-bottom:1px solid rgb(255, 82, 82);
}
.header > .row1 {
  display:flex;
  flex-direction: row;
  align-items:flex-end;
  justify-content:space-between;
}
.header h3 {
  display: inline-block;
  font-size: 18px;
  margin: 0px;
}

.header span {
  font-size: 22px;
  cursor: pointer;
}
.header .material-icons {
  margin: 0px;
}

.w-search .md-inline {
  margin: 0px;
  padding: 0px;
  height: 28px;
  min-height: 28px;
}
.w-search .md-inline:before {
  top: 27px;
}
.w-search label {
  top: 5px !important;
}
.w-search input {
  width: 100%;
}

.text-area {
  padding:10px 0px;
  overflow:auto;
}

</style>
<template>
<div style="display:flex;flex-direction:column;">
  <div class="upload-panel" style="flex:0 0 76px;background:#FFFFFF;border-bottom:1px solid #dadce0;padding:0px 10px 0px 10px;border-bottom:1px solid #cacaca;">
    <md-field class="md-layout-item">
      <label>upload image</label>
      <md-file ref="file" placeholder="click to select image" accept="image/*" v-model="fileName" @md-change=listen__file__onchange />
    </md-field>
  </div>
  <div style="flex:0 0 48px;display:flex;flex-direction:row;background:#eaeaea;padding:0px 15px;box-shadow:0px 3px 3px rgb(0, 0, 0, 30%);z-index:1;">
    <md-switch v-model="state.fitToWindow" @change="listen__btn_fitToWindow__onchange">fit to window</md-switch>
  </div>
</div>
</template>

<script>
/*

*/
/*
import PARSE from '@/js/parse.js'
import MISC from '@/js/miscellaneous.js'
*/
import { mapState } from 'vuex'

export default {
  name: 'ToolBar',
  data: function () {
    return {
      fileName: "",
      file: null,
      state: {
        fitToWindow: this.fitToWindow
      }
    }
  },
  methods: {
    listen__file__onchange: async function (files) {
      const Vue = this
      if (files.length == 0) {
        Vue.$emit('onfileerror', {message: "cancel"});
        return
      }
      if (files.length != 1) {
        Vue.$emit('onfileerror', {message: "support only one image input"});
        Vue.$refs.file.clearField();
        return
      }
      let tokens = files[0].name.split('.')
      if (tokens.length < 2) {
        Vue.$emit('onfileerror', {message: "only support jpg and png format"});
        Vue.$refs.file.clearField();
        return
      }
      let ext = tokens[tokens.length - 1].toLowerCase()
      if (ext != "jpg" && ext != "jpeg" && ext != "png") {
        Vue.$emit('onfileerror', {message: "only support jpg and png format"});
        Vue.$refs.file.clearField();
        return
      }

      if (Vue.fileName != files[0].name)
        Vue.fileName = files[0].name;
      Vue.$emit('onfilechange', files[0]);
    },
    listen__btn_fitToWindow__onchange: function () {
      if (this.$store.state.fitToWindow != this.state.fitToWindow)
        this.$store.commit('fitToWindow', {value: this.state.fitToWindow});
    },
    doubleRaf: function (callback) {
      requestAnimationFrame(() => {
        requestAnimationFrame(callback)
      })
    }
  },
  computed: mapState({
    fitToWindow: state => state.fitToWindow
  }),
  watch: {
    fitToWindow: function () {
      this.state.fitToWindow = this.fitToWindow;
    }
  }
}
</script>

<style scoped>
</style>
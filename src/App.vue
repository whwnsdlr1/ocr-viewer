<template>
<div class="body"
  oncontextmenu="return false"
  @dragenter="listen__x__ondragenter"
  @dragleave="listen__x__ondragleave"
  @dragover="listen__x__ondragover"
  @drop="listen__x__ondrop"
  >
  <tool-bar ref="tool-bar" :style="{flex: '0 0 124px'}"
    @onfilechange="listen__tool_bar__onfilechange"
    @onfileerror="listen__tool_bar__onfileerror" />
  <div class="sub-body" :style="{flex: '1 0 0'}">
    <image-view ref="image-view"
      :style="{flex: '2 0 0'}"
      :frame-data="$store.state.frameData"/>
    <result-view :style="{flex: '1 0 0'}"/>
  </div>
  <div>
    <usage-dialog />
  </div>
  <md-snackbar :md-position="'left'" :md-duration="2000" :md-active.sync="$store.state.showSnackbar" md-persistent>
    <span>{{ $store.state.messageSnackbar }}</span>
  </md-snackbar>
  <div v-if="$store.state.showLayer" class="mlayer">
    <div>
      <div class="w-spinner"><div class="spinner"></div></div>
      <span>{{ $store.state.messageLayer }}</span>
    </div>
  </div>
  <div v-if="$store.state.counterDrag > 0" class="m-drag-layer">
    <div>
      <span>Drop here</span>
    </div>
  </div>
</div>
</template>

<script>
import ToolBar from './views/ToolBar.vue'
import ImageView from './views/ImageView.vue'
import ResultView from './views/ResultView.vue'
import UsageDialog from './components/UsageDialog.vue'

import PARSE from '@/js/parse.js'
import MISC from '@/js/miscellaneous.js'

import recognize from '@/js/recognize.js'

export default {
  name: 'App',
  data: function () {
    return {
    }
  },
  components: {
    ToolBar,
    ImageView,
    ResultView,
    UsageDialog
  },
  methods: {
    listen__x__ondragenter: function (e) {
      e.preventDefault()
      this.$store.commit('counterDrag', {op: 'increment'});
    },
    listen__x__ondragleave: function (e) {
      e.preventDefault()
      this.$store.commit('counterDrag', {op: 'decrement'});
    },
    listen__x__ondragover: function (e) {
      e.preventDefault()
    },
    listen__x__ondrop: function (e) {
      e.preventDefault()
      this.$store.commit('counterDrag', {op: 'clear'});
      this.$refs['tool-bar'].listen__file__onchange(e.dataTransfer.files);
    },
    listen__tool_bar__onfilechange: function (file) {
      const Vue = this
      
      if (Vue.$store.state.frameData._empty == false) {
        Vue.$store.commit('frameData', {value: {
          id: MISC.getUuid4(),
          _empty: true,
          pred: []
        }});
      }
      Vue.$store.commit('showLayer', {value: true});
      
      Vue.doubleRaf(async () => {
        let image;
        Vue.$store.commit('messageLayer', {value: 'parse image...'});

        let tokens = file.name.split('.');
        let ext = tokens[tokens.length - 1].toLowerCase();
        try {
          image = await PARSE.parseImage(file, ext);
        } catch (err) {
          console.log(err)
          Vue.showSnackbar({message: "image parsing failure"})
          Vue.$refs['tool-bar'].$refs.file.clearField();
          Vue.$store.commit('showLayer', {value: false});
          return
        }
        let cornerstoneImage = await Vue.$cornerstone.createCornerstoneImageRgba(undefined, image.pixelData, image.width, image.height);

        Vue.$store.commit('messageLayer', {value: 'recognize...'});
        let pred;
        try {
          pred = await recognize.recognize(file);
        } catch (err) {
          console.log(err)
          Vue.showSnackbar({message: err})
          Vue.$refs['tool-bar'].$refs.file.clearField();
          Vue.$store.commit('showLayer', {value: false});
          return
        }
        Vue.$store.commit('frameData', {value: {
          id: MISC.getUuid4(),
          name: file.name,
          cornerstoneImage,
          _empty: false,
          pred
        }});
        Vue.$store.commit('showLayer', {value: false});
      });
    },
    listen__tool_bar__onfileerror: function (param) {
      console.log(param);
      const Vue = this;
      if (Vue.$store.state.frameData._empty == false) {
        Vue.$store.commit('frameData', {value: {
          id: MISC.getUuid4(),
          _empty: true,
          pred: []
        }});
      }
      this.showSnackbar(param);
    },
    showSnackbar: function (param) {
      this.$store.commit('messageSnackbar', {value: param.message});
      this.$store.commit('showSnackbar', {value: true});
      this.$store.commit('showLayer', {value: false});
    },
    doubleRaf: function (callback) {
      requestAnimationFrame(() => {
        requestAnimationFrame(callback)
      })
    }
  },
  mounted () {
  }
}
</script>

<style>
#app {
  position: relative;
  width: 100%;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 0;
  margin: 0;
  overflow: auto;
  background: rgb(239, 239, 239);
}

.body {
  display:flex;
  flex-direction:column;
  height:100%;
  width:100%;
}

.body > .sub-body {
  display:flex;
  flex-direction:row;
  overflow: hidden;
}

div {
  position: relative;
}

div.mlayer {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.75);
  align-items: center;
  justify-content: center;
  z-index: 99;
}
div.mlayer > div,
div.mlayer > span {
  margin-bottom: 10px;
  font-size: 14px;
}
div.m-drag-layer {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.75);
  align-items: center;
  justify-content: center;
  z-index: 98;
  pointer-events: none;
}
div.m-drag-layer > div,
div.m-drag-layer > span {
  margin-bottom: 10px;
  font-size: 50px;
}
.w-spinner {
  position:relative;
  display:inline-block;
  top: 7px;
  width:20px;
  height:20px;
  margin-right: 8px;
}
@keyframes spinner {
  to {transform: rotate(360deg);}
}
.spinner {
  position:relative;
  width: 100%;
  height: 100%;
}
.spinner:before {
  content: '';
  box-sizing: border-box;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #999;
  border-top-color: #000;
  animation: spinner .6s linear infinite;
}
::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 10px;
	background-color: #F5F5F5;
}

::-webkit-scrollbar
{
	width: 6px;
	background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb
{
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #AAA;
}
</style>

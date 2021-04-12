<template>
<div class="image-view"
    @touchstart="listen__view__on_x_down($event, 'touch')"
    @mousedown="listen__view__on_x_down($event, 'mouse')"
    @mousemove="listen__view__on_x_move($event, 'mouse')"
    @wheel="listen__view__onwheel">
  <frame
          ref="frame"
          :show-text-area="showTextArea"
          :fit-to-window="fitToWindow"
          :class="`frame-1-1`"
          :frame-data="frameData"
          :key="1234"
          @onimageload="$emit('onimageload')" />
  <div class="layer">
      <div class="md-fab-wrapper">
        <md-button class="md-fab md-mini" @click=listen__btn_usage__onclick><b>?</b>
        </md-button>
      </div>
  </div>
</div>
</template>

<script>
import Frame from '@/components/Frame'

export default {
  props: {
    frameData: Object,
    showTextArea: Boolean,
    fitToWindow: Boolean
  },
  components: {
    Frame
  },
  methods: {
    listen__btn_usage__onclick: function () {
      this.$store.commit('usageDialog', {value: true})
    },
    listen__view__on_x_down: function (e, type) {
      this.$refs['frame'].listen__view__on_x_down(e, type);
    },
    listen__view__onwheel: function (e) {
      this.$refs['frame'].listen__view__onwheel(e);
    },
    listen__view__on_x_move: function (e, type) {
      this.$refs['frame'].listen__view__on_x_move(e, type);
    }
  }
}
</script>

<style scoped>
.image-view {
  background-color: #eee;
  background-image: 
    linear-gradient(45deg,#ddd 25%,transparent 0,transparent 75%,#ddd 0,#ddd),
    linear-gradient(45deg,#ddd 25%,transparent 0,transparent 75%,#ddd 0,#ddd);
  background-size: 40px 40px;
  background-position: 0 0,20px 20px;
  background-position-x: 0px, 20px;
  background-position-y: 0px, 20px;
  overflow: hidden;
}

.layer {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.layer .md-fab-wrapper {
  position:absolute;
  bottom: 5px;
  right: 5px;
}

.md-button-content b {
  position: relative;
  margin-left: 0px;
  top: -2px;
  font-size: 20px !important;
  color: rgb(255, 255, 255);
}

.material-icons {
  margin-left: 0px;
  margin-top: 8px;
  font-size: 24px;
  color: #FFFFFF;
}
</style>
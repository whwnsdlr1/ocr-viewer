<template>
  <div class="body">
  </div>
</template>

<script>
/* eslint-disable no-console */
import lodash from 'lodash'
import elementResizeEvent from 'element-resize-event'

export default {
  props: ['frame-data', 'show-text-area', 'fit-to-window'],
  data: function () {
    return {
      imageLayerId: undefined,
      loaded: false,
      state: {
        coord: {
          x: 0,
          y: 0
        },
        zoom: undefined,
        voi: {
          windowCenter: 127,
          windowWidth: 256
        }
      },
      internalState: {
        moveTouch: undefined,
        zoomTouch: undefined
      },
      style: {
        boxColor: '#FFFF00',
        highlightBoxColor: '#FF0000'
      }
    }
  },
  methods: {
    listen__x__onresize: function () {
      const Vue = this
      if (Vue.frameData._empty == false) {
        const style = getComputedStyle(this.$el)
        const scaleY = parseInt(style.height) / this.frameData.cornerstoneImage.height
        const scaleX = parseInt(style.width) / this.frameData.cornerstoneImage.width
        const zoom0 = (scaleY < scaleX)? scaleY : scaleX;
        if (Math.abs(this.state.zoom - zoom0) > 1e-5) {
          Vue.$cornerstone.resize(Vue.$el, false)
          this.$store.commit('fitToWindow', {value: false});
          let layers = this.$cornerstone.getLayers(this.$el)
          for (let i = 0; i < layers.length; i++) {
            let viewport = layers[i].viewport
            viewport.scale = Vue.state.zoom
            viewport.translation.x = Vue.state.coord.x
            viewport.translation.y = Vue.state.coord.y
          }
          this.$cornerstone.updateImage(this.$el)
        }
      }
    },
    listen__view__on_x_down: function (e, type) {
      const Vue = this
      if (Vue.loaded == false)
        return
      function mouseLeftUpHandler (e) {
        if (e.which == 1) {
          Vue.$parent.$el.removeEventListener('mousemove', mouseLeftMoveHandler)
          Vue.$parent.$el.removeEventListener('mouseup', mouseLeftUpHandler)
        }
      }
      function mouseRightUpHandler (e) {
        if (e.which == 3) {
          Vue.$parent.$el.removeEventListener('mousemove', mouseRightMoveHandler)
          Vue.$parent.$el.removeEventListener('mouseup', mouseRightUpHandler)
        }
      }
      function touchUpHandler (e) {
        if (Array.prototype.findIndex.call(e.changedTouches, v => v.identifier == Vue.internalState.moveTouch.identifier) == -1) return
        Vue.internalState.moveTouch = undefined

        Vue.$parent.$el.removeEventListener('touchmove', touchMoveHandler)
        Vue.$parent.$el.removeEventListener('touchend', touchUpHandler)
      }
      function touchUpHandler2 (e) {
        if (Array.prototype.findIndex.call(e.changedTouches, v => v.identifier == Vue.internalState.zoomTouch.identifier) == -1) return
        Vue.internalState.zoomTouch = undefined

        Vue.$parent.$el.removeEventListener('touchmove', touchMoveHandler2)
        Vue.$parent.$el.removeEventListener('touchend', touchUpHandler2)
      }
      function mouseLeftMoveHandler (e) {
        const deltaX = e.pageX - lastX
        const deltaY = e.pageY - lastY
        lastX = e.pageX
        lastY = e.pageY

        const x = Vue.state.coord.x + (deltaX / Vue.state.zoom)
        const y = Vue.state.coord.y + (deltaY / Vue.state.zoom)
        // Vue.state.coord = {x, y}
        Vue.listen__state__tochange({coord: {x, y}}, false)
      }
      function mouseRightMoveHandler (e) {
        const deltaX = e.pageX - lastX
        const deltaY = e.pageY - lastY
        lastX = e.pageX
        lastY = e.pageY

        const windowWidth = Math.min(256, Math.max(1, Vue.state.voi.windowWidth + (deltaX / Vue.state.zoom)))
        const windowCenter = Math.min(255, Math.max(0, Vue.state.voi.windowCenter + (deltaY / Vue.state.zoom)))
        // Vue.state.voi = {windowWidth, windowCenter}
        Vue.listen__state__tochange({voi: {windowWidth, windowCenter}}, false)
      }
      function touchMoveHandler (e) {
        const idx = Array.prototype.findIndex.call(e.changedTouches, v => v.identifier == Vue.internalState.moveTouch.identifier)
        if (idx == -1) return
        const touch = e.changedTouches[idx]

        const deltaX = touch.pageX - lastX
        const deltaY = touch.pageY - lastY
        lastX = touch.pageX
        lastY = touch.pageY

        if (Vue.internalState.zoomTouch == undefined) {
          const x = Vue.state.coord.x + (deltaX / Vue.state.zoom)
          const y = Vue.state.coord.y + (deltaY / Vue.state.zoom)
          // Vue.state.coord = {x, y}
          Vue.listen__state__tochange({coord: {x, y}}, false)
        }
      }
      function touchMoveHandler2 (e) {
        const idx = Array.prototype.findIndex.call(e.changedTouches, v => v.identifier == Vue.internalState.zoomTouch.identifier)
        if (Vue.internalState.moveTouch == undefined || idx == -1) return
        const touch = e.changedTouches[idx]

        const cdist = 2.5 * (Math.abs(touch.pageX - Vue.internalState.moveTouch.pageX) + Math.abs(touch.pageY - Vue.internalState.moveTouch.pageY)) / (window.innerHeight + window.innerWidth)
        if (dist == undefined) {
          dist = cdist
          return
        }
        const as = cdist - dist
        dist = cdist
        const scale = Vue.state.zoom + as
        if (scale > 0) {
          // Vue.state.zoom = scale
          Vue.listen__state__tochange({zoom: scale}, false)
        }
      }
      function mouseLeftDownHandler () {
        Vue.$parent.$el.addEventListener('mousemove', mouseLeftMoveHandler)
        Vue.$parent.$el.addEventListener('mouseup', mouseLeftUpHandler)
      }
      function mouseRightDownHandler () {
        Vue.$parent.$el.addEventListener('mousemove', mouseRightMoveHandler)
        Vue.$parent.$el.addEventListener('mouseup', mouseRightUpHandler)
      }
      function touchDownHandler () {
        Vue.$parent.$el.addEventListener('touchmove', touchMoveHandler)
        Vue.$parent.$el.addEventListener('touchend', touchUpHandler)
      }
      function touchDown2Handler () {
        Vue.$parent.$el.addEventListener('touchmove', touchMoveHandler2)
        Vue.$parent.$el.addEventListener('touchend', touchUpHandler2)
      }

      if (Vue.state.coord == undefined) return

      e.preventDefault()
      let lastX, lastY, dist
      if (type == 'touch' && e.which == 0) {
        if (Vue.internalState.moveTouch != undefined) {
          Vue.internalState.zoomTouch = Vue.copyTouch(e.changedTouches[0])
          touchDown2Handler()
        } else {
          Vue.internalState.moveTouch = Vue.copyTouch(e.changedTouches[0])
          lastX = e.changedTouches[0].pageX
          lastY = e.changedTouches[0].pageY
          touchDownHandler()
        }
      } else if (type == 'mouse' && e.which == 1) {
        lastX = e.pageX
        lastY = e.pageY
        mouseLeftDownHandler()
      }
      else if (type == 'mouse' && e.which == 3) {
        lastX = e.pageX
        lastY = e.pageY
        mouseRightDownHandler()
      }
    },
    listen__view__onwheel: function (e) {      
      const Vue = this
      if (Vue.loaded == false)
        return
      if (Vue.state.zoom == undefined) return
      const as = e.wheelDelta < 0 || e.detail > 0 || e.deltaY >= 0 ? -0.10 : 0.10
      const scale = Vue.state.zoom + as
      if (scale > 0) {
        // Vue.state.zoom = scale
        Vue.listen__state__tochange({zoom: scale}, false)
      }
      return false
    },
    listen__state__tochange: function (data, use_layer = true) {
      async function change () {
        if (data.coord != undefined) {
          Vue.state.coord = {x: data.coord.x, y: data.coord.y}
        }
        if (data.zoom != undefined) {
          Vue.state.zoom = data.zoom
        }
        if (data.voi != undefined) {
          Vue.state.voi = {windowCenter: data.voi.windowCenter, windowWidth: data.voi.windowWidth}
        }
      }
      const Vue = this
      if (use_layer == true) {
        Vue.layer.message = 'update state...'
        Vue.layer.active = true
        Vue.doubleRaf(change)
      } else
        change()
      Vue.$emit('onstatechange', data)
    },
    updateTagging: function () {
      if (this.loaded == true && this.frameData._empty == false) {
        this.$cornerstoneTools.clearToolState(this.$el, 'FreehandRoi');
        for (let datum of this.$store.state.frameData.pred) {
          if (datum.active == false)
            continue
          let points = []
          for (let point of datum.points) {
            points.push({x: point.x, y: point.y, highlight: false, active: false, lines: []});
          }
          points.push({x: points[0].x, y: points[0].y, highlight: false, active: false, lines: []});
          const measurementData = {
            visiable: true,
            active: false,
            invalidated: true,
            color: datum.highlight ? this.style.highlightBoxColor : this.style.boxColor,
            handles: {
              points,
              textBox: {
                freehand: true,
                active: false,
                hasMoved: false,
                movesIndependently: false,
                drawIndependently: true,
                allowOutsideImage: true,
                hasBoundingBox: true
              }
            }
          }
          this.$cornerstoneTools.addToolState(this.$el, 'FreehandRoi', measurementData)
        }
        this.$cornerstone.updateImage(this.$el);
      }
    }
  },
  computed: {
  },
  watch: {
    "state.coord": function (coord) {
      if (this.loaded == true && this.frameData._empty == false && coord != undefined) {
        let layers = this.$cornerstone.getLayers(this.$el)
        if (Math.abs(coord.x) > 1e-5 || Math.abs(coord.y) > 1e-5)
          this.$store.commit('fitToWindow', {value: false});
        for (let i = 0; i < layers.length; i++) {
          let viewport = layers[i].viewport
          viewport.translation.x = coord.x
          viewport.translation.y = coord.y
        }
        this.$cornerstone.updateImage(this.$el)
      }
    },
    'state.zoom': function (zoom) {
      if (this.loaded == true && this.frameData._empty == false && zoom != undefined) {
        const style = getComputedStyle(this.$el)
        const scaleY = parseInt(style.height) / this.frameData.cornerstoneImage.height
        const scaleX = parseInt(style.width) / this.frameData.cornerstoneImage.width
        const zoom0 = (scaleY < scaleX)? scaleY : scaleX;
        if (Math.abs(zoom - zoom0) > 1e-5)
          this.$store.commit('fitToWindow', {value: false});
        let layers = this.$cornerstone.getLayers(this.$el)
        for (let i = 0; i < layers.length; i++) {
          let viewport = layers[i].viewport
          viewport.scale = zoom
        }
        this.$cornerstone.updateImage(this.$el)
      }
    },
    'state.voi': function (voi) {
      if (this.loaded == true && this.frameData._empty == false) {
        let layer = this.$cornerstone.getLayer(this.$el, this.imageLayerId)
        layer.viewport.voi.windowWidth = voi.windowWidth
        layer.viewport.voi.windowCenter = voi.windowCenter
        this.$cornerstone.updateImage(this.$el)
      }
    },
    'frameData._empty': function (isEmpty) {
      if (isEmpty == false) {
        this.$cornerstone.enable(this.$el);
        elementResizeEvent(this.$el, lodash.debounce(this.listen__x__onresize, 10))
        const image = this.frameData.cornerstoneImage
        let defViewport = this.$cornerstone.getDefaultViewport(this.$el, image)
        const style = getComputedStyle(this.$el)
        const scaleY = parseInt(style.height) / image.height
        const scaleX = parseInt(style.width) / image.width

        this.state = {
          coord: {
            x: 0,
            y: 0
          },
          zoom: (scaleY < scaleX)? scaleY : scaleX,
          voi: {
            windowCenter: 127,
            windowWidth: 256
          }
        }

        defViewport.scale = this.state.zoom
        defViewport.translation.y = this.state.coord.y
        defViewport.translation.x = this.state.coord.x
        defViewport.voi.windowCenter = this.state.voi.windowCenter
        defViewport.voi.windowWidth = this.state.voi.windowWidth
        const imageLayerId = this.$cornerstone.addLayer(this.$el, this.frameData.cornerstoneImage, {viewport: defViewport})
        this.imageLayerId = imageLayerId
        this.loaded = true;
        this.$store.commit('fitToWindow', {value: true});
        
        const FreehandRoiTool = this.$cornerstoneTools.FreehandRoiTool;
        this.$cornerstoneTools.addToolForElement(this.$el, FreehandRoiTool);
        this.$cornerstoneTools.setToolEnabledForElement(this.$el, 'FreehandRoi', { mouseButtonMask: 2 })
        this.$store.commit('updateTagging');
      } else {
        this.loaded = false;
        elementResizeEvent.unbind(this.$el);
        this.$cornerstone.disable(this.$el);
      }
    },
    '$store.state.fitToWindow': function (fitToWindow) {
      if (this.loaded == true && this.frameData._empty == false) {
        if (fitToWindow == true) {
          const style = getComputedStyle(this.$el)
          const scaleY = parseInt(style.height) / this.frameData.cornerstoneImage.height
          const scaleX = parseInt(style.width) / this.frameData.cornerstoneImage.width
          
          this.state.coord = {x: 0, y: 0};
          this.state.zoom = (scaleY < scaleX)? scaleY : scaleX;
        }
      }
    },
    '$store.state.updateTagging': function () {
      this.updateTagging()
    }
  }
}
</script>

<style scoped>
.body {
  position: relative;
  min-width: 0;
  min-height: 0;
  margin: 0;
  padding: 0;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently
                                supported by Chrome and Opera */
}
.body * {
  pointer-events: none;
}
</style>
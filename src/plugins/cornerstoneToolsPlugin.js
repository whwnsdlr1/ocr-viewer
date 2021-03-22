import cornerstone from 'cornerstone-core'
import Hammer from 'hammerjs'
import cornerstoneMath from 'cornerstone-math'
import cornerstoneTools from 'cornerstone-tools'

export default {
  install: function (Vue) {
    cornerstoneTools.toolStyle.setToolWidth(2);
    cornerstoneTools.external.cornerstone = cornerstone
    cornerstoneTools.external.Hammer = Hammer
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath
    cornerstoneTools.init()
    Vue.prototype.$cornerstoneTools = cornerstoneTools
  }
}

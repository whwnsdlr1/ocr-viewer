import cornerstone from 'cornerstone-core'

function getUuid4 () {
  // return uuid of form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  let uuid = ''
  let ii
  for (ii = 0; ii < 32; ii += 1) {
    switch (ii) {
      case 8:
      case 20:
        uuid += '-'
        uuid += (Math.random() * 16 | 0).toString(16)
        break
      case 12:
        uuid += '-'
        uuid += '4'
        break
      case 16:
        uuid += '-'
        uuid += (Math.random() * 4 | 8).toString(16)
        break
      default:
        uuid += (Math.random() * 16 | 0).toString(16)
    }
  }
  return uuid
}

function loadImageRgba (imageId, param) {
  const width = param.width
  const height = param.height
  let pixelData = param.pixelData
  const maxVal = 255

  const sizeInBytes = width * height * 4
  // const render = isColor === true ? cornerstone.renderColorImage : cornerstone.renderGrayscaleImage
  const render = cornerstone.renderColorImage

  const cornerstoneImage = {
    imageId: imageId,
    minPixelValue: 0,
    maxPixelValue: maxVal,
    slope: 1.0,
    intercept: 0,
    windowCenter: 127,
    windowWidth: 256,
    render: render,
    getPixelData: function () { return pixelData },
    rows: height,
    columns: width,
    height: height,
    width: width,
    color: true,
    columnPixelSpacing: 1.0,
    rowPixelSpacing: 1.0,
    invert: false,
    sizeInBytes: sizeInBytes
  }
  return {
    promise: new Promise(function (resolve) {
      resolve(cornerstoneImage)
    }),
    cancelFn: undefined
  }
}

export default {
  install: function (Vue) {
    cornerstone.registerImageLoader('rgbaLoader', loadImageRgba)
    function createCornerstoneImageRgba (id, pixelData, width, height) {
      return new Promise(function (resolve) {
        id = id == undefined? getUuid4() : id
        cornerstone.loadImage(`rgbaLoader:${id}`, {pixelData, width, height}).then(function (image) {
          resolve(image)
        })
      })
    }

    Vue.prototype.$cornerstone = cornerstone
    Vue.prototype.$cornerstone.createCornerstoneImageRgba = createCornerstoneImageRgba
  }
}

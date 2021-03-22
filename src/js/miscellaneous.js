function getDateString () {
  let today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth() + 1 // January is 0!

  let yyyy = today.getFullYear()
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  return yyyy + '.' + mm + '.' + dd
}

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

function createElement (tag, style, options = {}) {
  let parent = options['parent']
  let id = options['id']
  let classlist = options['class']
  let text = options['text']
  let innerHTML = options['innerHTML']
  let attrs = options['attrs']

  let dom = document.createElement(tag)
  for (let key in style) dom.style[key] = style[key]
  if (parent !== undefined) parent.appendChild(dom)
  if (id !== undefined) dom.id = id
  if (classlist !== undefined) dom.className = classlist
  if (text !== undefined) dom.textContent = text
  if (innerHTML !== undefined) dom.innerHTML = innerHTML
  if (attrs !== undefined) {
    for (let key in attrs) dom.setAttribute(key, attrs[key])
  }

  return dom
}

function argMax (array) {
  if (array.length > 0) {
    let maxIdx = 0
    let maxVal = array[0]
    for (let i = 1; i < array.length; i++) {
      const val = array[i]
      if (val > maxVal) {
        maxVal = val
        maxIdx = i
      }
    }
    return maxIdx
  } else {
    return -1
  }
}

function resizeImg (pixelData, width, height, dstWidth, dstHeight) {
  var canvasCopy = document.createElement('canvas')
  var copyContext = canvasCopy.getContext('2d')
  var canvasCopy2 = document.createElement('canvas')
  var copyContext2 = canvasCopy2.getContext('2d')
  canvasCopy.width = width;
  canvasCopy.height = height;
  copyContext.putImageData(new ImageData(new Uint8ClampedArray(pixelData), width, height), 0, 0)

  // init
  canvasCopy2.width = dstWidth
  canvasCopy2.height = dstHeight
  copyContext2.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasCopy2.width, canvasCopy2.height)
  return copyContext2.getImageData(0, 0, dstWidth, dstHeight).data
}

/*
MIT LICENSE
Copyright 2011 Jon Leighton
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
function convertBufferToBase64 (arrayBuffer) {
  var base64 = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes = new Uint8Array(arrayBuffer.buffer)
  var byteLength = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63 // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder === 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder === 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }

  return base64
}

function convertBase64ToBuffer (base64) {
  var binaryString = atob(base64)
  var len = binaryString.length
  var bytes = new Uint8Array(len)
  for (var i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

function convertGRAY2RGBA (pixelData) {
  let ret = new Uint8Array(pixelData.length * 4)
  for (let i = 0; i < pixelData.length; i++) {
    const k = i * 4
    let val = pixelData[i]
    ret[k] = val
    ret[k + 1] = val
    ret[k + 2] = val
    ret[k + 3] = 255
  }
  return ret
}

function convertRGB2RGBA (pixelData) {
  let ret = new Uint8Array(pixelData.length / 3 * 4)
  for (let i = 0; i < pixelData.length; i += 3) {
    const k = i / 3 * 4
    ret[k] = pixelData[i]
    ret[k + 1] = pixelData[i + 1]
    ret[k + 2] = pixelData[i + 2]
    ret[k + 3] = 255
  }
  return ret
}

function convertRGB2RGBA1 (pixelData) {
  const area = pixelData.length / 3
  var ret = new Uint8Array(area * 4)
  for (let i = 0; i < area; i++) {
    var k = i * 4
    ret[k] = pixelData[i]
    ret[k + 1] = pixelData[i + area]
    ret[k + 2] = pixelData[i + area + area]
    ret[k + 3] = 255
  }
  return ret
}

function convertRGBA2RGB (pixelData) {
  let ret = new Uint8Array(pixelData.length / 4 * 3)
  for (let i = 0; i < pixelData.length; i += 4) {
    const k = i / 4 * 3
    ret[k] = pixelData[i]
    ret[k + 1] = pixelData[i + 1]
    ret[k + 2] = pixelData[i + 2]
  }
  return ret
}

function convertHexToRgb (hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b
  })
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function convertRgbToHex (r, g, b) {
  function toHex(v) {
    let hex = Number(v).toString(16)
    if (hex.length < 2) {
      hex = `0${hex}`
    }
    return hex
  }
  
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export default {
  getDateString,
  getUuid4,
  createElement,
  argMax,
  resizeImg,
  convertBufferToBase64,
  convertBase64ToBuffer,
  convertGRAY2RGBA,
  convertRGB2RGBA,
  convertRGB2RGBA1,
  convertRGBA2RGB,
  convertHexToRgb,
  convertRgbToHex
}

/* eslint-disable no-console */
import JPEGJS from 'jpeg-js'
import PNGJS from 'pngjs'

function readFile (file) {
  return new Promise((resolve) => {
    let reader = new FileReader()
    reader.onload = async function (e) {
      resolve(e.target.result)
    }
    reader.readAsArrayBuffer(file)
  })
}

function parseJpg (arrayBuffer) {
  return new Promise(function (resolve, reject) {
    try {
      const byteArray = new Uint8Array(arrayBuffer)
      const data = JPEGJS.decode(byteArray, true)

      resolve({pixelData: data.data, width: data.width, height: data.height})
    } catch (err) {
      reject(err)
    }
  })
}

function parsePng (arrayBuffer) {
  return new Promise(function (resolve, reject) {
    const byteArray = new Uint8Array(arrayBuffer)
    new PNGJS.PNG({filterType: 4}).parse(byteArray, async function (error, data) {
      try {
        if (error != null)
          reject(error)

        resolve({pixelData: data.data, width: data.width, height: data.height})
      } catch (err) {
        reject(err)
      }
    })
  })
}


async function parseImage (blob, ext) {
  if (!(blob instanceof Blob)) {
    throw new Error('blob must be a instance of Blob')
  }
  if (typeof(ext) != 'string') {
    throw new Error('extension must be a type of string')
  }
  let res
  if (ext.toLowerCase().endsWith('jpg') || ext.toLowerCase().endsWith('jpeg')) {
    const arrayBuffer = await readFile(blob)
    res = await parseJpg(arrayBuffer)
  } else if(ext.toLowerCase().endsWith('png')) {
    const arrayBuffer = await readFile(blob)
    res = await parsePng(arrayBuffer)
  } else {
    throw new Error('unsupported extension')
  }
  return res
}

export default {
  parseImage,
  parsePng,
  parseJpg
}

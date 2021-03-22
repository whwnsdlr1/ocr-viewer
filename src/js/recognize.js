/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

/** @breif WebSocket example. don't forget to run the python websocket server on 'localhost' and '8999'.
*/
function recognizeImplUsingWebSocket (base64Bytes) {
  return new Promise(function (resolve, reject) {
    let webSocket = new WebSocket("ws://localhost:8999");	
    webSocket.onopen = function(message) {	
      webSocket.send(JSON.stringify({data: base64Bytes}));
    }
    webSocket.onclose = function(message) {
      if (message.code != 1000)
        reject('failed to recognize. ' + message.code)
    }
    webSocket.onerror = function(message) {	
      reject('could\'t connect to websocket server. Check the readme / Demo tab.')
      webSocket.close()
    }
    webSocket.onmessage = function(message) {
      let ret = JSON.parse(message.data)
      if (ret.code == 0) {
        resolve(ret.result)
      }
      else {
        reject('failed to recognize.')
      }
      webSocket.close()
    }
  })
}

/** @breif Implement your recognizeImpl function here.
@param data URL of the image encoded as base64 (ex> data:image/jpeg,base64,SGVsbG8sIFdvcmxkIQ%3D%3D...)

@return predicted data of (n, 3) shape. [[id, text, probability]] (ex> [[0, 'hello', '0.88'], [1, '안녕하세요', '0.99'], ...])
*/
function recognizeImpl (base64Bytes) {
  return new Promise(function (resolve, reject) {
    resolve([])
  })
}

async function recognize (file) {
  const base64Bytes = await toBase64(file);
  // const data = await recognizeImpl(base64Bytes);
  const data = await recognizeImplUsingWebSocket(base64Bytes);
  
  let pred = []
  for (let i in data) {
    let datum = data[i]
    pred.push({
      id: i, text: datum[1], prob: datum[2],
      active: true,
      highlight: false,
      points: [
        {x: datum[0][0][0], y: datum[0][0][1]},
        {x: datum[0][1][0], y: datum[0][1][1]},
        {x: datum[0][2][0], y: datum[0][2][1]},
        {x: datum[0][3][0], y: datum[0][3][1]},
      ]
    });
  }

  return pred;
}

export default {
  recognize
}

import json
import asyncio
import websockets
import easyocr
from server_util import readb64, NpEncoder

port = 8999

if __name__ == '__main__':
  print('initailize EasyOCR')
  reader = easyocr.Reader(['en'])

  async def accept(websocket, path):
    data = await websocket.recv()
    img = readb64(data)
    result = reader.readtext(img)

    await websocket.send(json.dumps({'code': 0, 'result': result}, cls = NpEncoder))
    await websocket.close()
    print('wait job...')

  print('wait job...')
  start_server = websockets.serve(accept, "localhost", port, max_size = 10 * 2 ** 20)
  asyncio.get_event_loop().run_until_complete(start_server)
  asyncio.get_event_loop().run_forever()
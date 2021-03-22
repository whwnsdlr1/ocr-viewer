import json
import asyncio
import websockets
from paddleocr import PaddleOCR
from server_util import readb64, NpEncoder

port = 8999

if __name__ == '__main__':
  print('initailize PaddleOCR')
  ocr = PaddleOCR(lang = 'korean', use_gpu = False)

  async def accept(websocket, path):
    data = await websocket.recv()
    img = readb64(data)
    result = ocr.ocr(img)
    result = [[row[0], row[1][0], row[1][1]] for row in result]

    await websocket.send(json.dumps({'code': 0, 'result': result}, cls = NpEncoder))
    websocket.close()
    print('wait job...')

  print('wait job...')
  start_server = websockets.serve(accept, "localhost", port, max_size = 10 * 2 ** 20)
  asyncio.get_event_loop().run_until_complete(start_server)
  asyncio.get_event_loop().run_forever()
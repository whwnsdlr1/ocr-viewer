import struct
import base64
import json
import numpy as np
import cv2

def recvall(sock, n):
  # Helper function to recv n bytes or return None if EOF is hit
  data = bytearray()
  while len(data) < n:
    packet = sock.recv(n - len(data))
    if not packet:
      return None
    data.extend(packet)
  return data

def send_msg(sock, msg):
  # Prefix each message with a 4-byte length (network byte order)
  msg = struct.pack('>I', len(msg)) + msg
  sock.sendall(msg)

def recv_msg(sock):
  # Read message length and unpack it into an integer
  raw_msglen = recvall(sock, 4)
  if not raw_msglen:
    return None
  msglen = struct.unpack('>I', raw_msglen)[0]
  # Read the message data
  return recvall(sock, msglen)

def readb64(uri):
  encoded_data = uri.split(',')[1]
  nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
  img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
  return img

class NpEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, np.integer):
      return int(obj)
    elif isinstance(obj, np.floating):
      return float(obj)
    elif isinstance(obj, np.ndarray):
      return obj.tolist()
    else:
      return super(NpEncoder, self).default(obj)
import asyncio
import websockets
from threading import Thread
import time
import datetime
import random

class Th(Thread):
    def __init__(self, ws):
        Thread.__init__(self)
        self.ws = ws

    def run(self):
        while(True):
            now = datetime.datetime.utcnow().isoformat() + "Z"
            self.ws.send(now)
            time.sleep(random.random() * 3)

async def hello(websocket, path):
    a = Th(websocket)
    a.start()
    while(True):
        name = await websocket.recv()
        print(f"< {name}")
        greeting = f"Hello {name}!"
        await websocket.send(greeting)
        print(f"> {greeting}")

start_server = websockets.serve(hello, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
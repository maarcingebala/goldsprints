import asyncio
import websockets


async def handler():
    async with websockets.connect('ws://localhost:8765') as websocket:
        while True:
            data = await websocket.recv()
            print("> %s" % data)


asyncio.get_event_loop().run_until_complete(handler())

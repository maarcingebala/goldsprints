import asyncio
import json
import signal
import sys
import time

import serial
import websockets

PORT = '/dev/ttyACM0'  # USB port
PLAYER_A = 'a'
PLAYER_B = 'b'


class SerialDataReceiver(object):
    BAUDRATE = 9600
    SERIAL_TIMEOUT = 0.1
    SERVER_PRECISION = 0.025
    VALID_DATA_TIMEOUT = 0.5
    WEBSOCKET_PORT = 8765

    def __init__(self, port):
        self._port = port
        self._serial = None
        self._last_read_time = 0
        self._loop = asyncio.get_event_loop()
        self._loop.add_signal_handler(getattr(signal, 'SIGINT'), self.stop)
        self._loop.add_signal_handler(getattr(signal, 'SIGTERM'), self.stop)
        self.reset_speed()

    def start(self):
        try:
            self._serial = serial.Serial(
                self._port, self.BAUDRATE, timeout=self.SERIAL_TIMEOUT)
        except serial.SerialException:
            print("Failed to connect to %s" % self._port)
        else:
            print("Start reading from %s" % self._serial.name)
            self._loop.add_reader(self._serial.fileno(), self._read_from_serial)
            server_task = websockets.serve(
                self._run_server, 'localhost', self.WEBSOCKET_PORT)
            self._loop.run_until_complete(server_task)
            self._loop.run_forever()
        finally:
            self._loop.close()
    
    def reset_speed(self):
        self.speed_a = 0
        self.speed_b = 0

    def _read_from_serial(self):
        try:
            line = str(self._serial.readline().decode()).strip()
            player_id, speed = line.split('|')
            speed = float(speed)
            if speed != float('inf'):
                if player_id == PLAYER_A:
                    self.speed_a = speed
                elif player_id == PLAYER_B:
                    self.speed_b = speed
                else:
                    print('Unknown player ID : %s' % player_id)
                self._last_read_time = time.time()
        except Exception as e:
            print("Error: %s" % e)
            self.reset_speed()

    async def _run_server(self, websocket, path):
        print("Start websocket server on %s" % self.WEBSOCKET_PORT)
        interval = self.SERVER_PRECISION
        while True:
            await asyncio.sleep(interval)
            if time.time() - self._last_read_time > self.VALID_DATA_TIMEOUT:
                self.reset_speed()

            data = {
                'speed_a': '%.3f' % (self.speed_a / 3.6),
                'speed_b': '%.3f' % (self.speed_b / 3.6),
                'interval': '%s' % interval
            }
            print("[Data] %s" % data)
            try:
                await websocket.send(json.dumps(data))
            except websockets.ConnectionClosed:
                print("Connection closed")
                break

    def stop(self):
        self._serial.close()
        self._loop.stop()


if __name__ == '__main__':
    try:
        receiver_port = sys.argv[1]
    except IndexError:
        receiver_port = PORT
    data_receiver = SerialDataReceiver(receiver_port)
    data_receiver.start()

import asyncio
import json
import signal
import sys
import time

import serial
import websockets

PORT = '/dev/ttyACM0'  # USB port


class SerialDataReceiver(object):
    BAUDRATE = 9600
    SERIAL_TIMEOUT = 0.1
    SERVER_PRECISION = 0.01
    VALID_DATA_TIMEOUT = 0.5
    WEBSOCKET_PORT = 8765

    def __init__(self, port):
        self._port = port
        self._serial = None
        self._last_read_time = 0
        self._loop = asyncio.get_event_loop()
        self._loop.add_signal_handler(getattr(signal, 'SIGINT'), self.stop)
        self._loop.add_signal_handler(getattr(signal, 'SIGTERM'), self.stop)
        self.current_speed = 0

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

    def _read_from_serial(self):
        self.current_speed = 0
        try:
            raw_value = float(self._serial.readline())
            print("Received: %s" % raw_value)
        except (serial.SerialException, ValueError) as e:
            print("Error: %s" % e)
        else:
            if raw_value != float("inf"):
                self.current_speed = raw_value
            self._last_read_time = time.time()

    async def _run_server(self, websocket, path):
        print("Start websocket server on %s" % self.WEBSOCKET_PORT)
        interval = self.SERVER_PRECISION
        while True:
            await asyncio.sleep(interval)
            if time.time() - self._last_read_time > self.VALID_DATA_TIMEOUT:
                self.current_speed = 0

            speed_kmh = self.current_speed
            speed_ms = speed_kmh / 3.6
            data = {
                'speedKmh': '%.3f' % speed_kmh,
                'speedMs': '%.3f' % speed_ms,
                'interval': '%s' % interval}
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

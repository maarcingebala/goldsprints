import asyncio
import json
import sys
import time
from threading import Thread

import serial
import websockets

PORT = '/dev/ttyACM0'  # USB port


def format_speed(value):
    return '%.2f km/h' % value


class SerialDataReceiver(object):
    BAUDRATE = 9600
    SERIAL_TIMEOUT = 0.1
    VALID_DATA_TIMEOUT = 0.5

    def __init__(self, port):
        self.current_speed = 0
        self.is_running = False
        self._port = port
        self._serial = None
        self._last_read_time = 0

    def start(self):
        try:
            self._serial = serial.Serial(
                self._port, self.BAUDRATE, timeout=self.SERIAL_TIMEOUT)
        except serial.SerialException:
            print("Failed to connect to %s" % self._port)
        else:
            self.is_running = True
            t = Thread(target=self.read_from_serial)
            t.start()
            print("Started receiver from %s" % self._serial.name)

    def read_from_serial(self):
        while self.is_running:
            try:
                self.current_speed = float(self._serial.readline().strip())
            except (serial.SerialException, ValueError):
                pass
            else:
                self._last_read_time = time.time()
                print("Received: %s" % self.current_speed)
            if time.time() - self._last_read_time > self.VALID_DATA_TIMEOUT:
                self.current_speed = 0

    def stop(self):
        self.is_running = False
        self._serial.close()


class DistanceServer(object):
    TIME_PRECISION = 0.01
    WEBSOCKET_PORT = 8765

    def __init__(self, data_receiver):
        self.data_receiver = data_receiver
        self.is_running = False
        self.start_ride_time = 0
        self.end_time = 0
        self.distance = 100  # 100m
        self.curr_position = 0

    def start(self):
        if self.data_receiver.is_running:
            self.is_running = True
            start_server = websockets.serve(self._run, 'localhost', self.WEBSOCKET_PORT)
            print("Starting websocket server on %s" % self.WEBSOCKET_PORT)
            asyncio.get_event_loop().run_until_complete(start_server)
            asyncio.get_event_loop().run_forever()

    def reset(self):
        self.curr_position = 0
        self.start_ride_time = 0

    def stop(self):
        self.end_time = time.time()
        self.is_running = False

    async def _run(self, websocket, path):
        interval = self.TIME_PRECISION
        while self.is_running and self.data_receiver.is_running:
            await asyncio.sleep(interval)
            speed_kmh = self.data_receiver.current_speed
            speed_ms = speed_kmh / 3.6
            curr_distance = speed_ms * interval
            self.curr_position += curr_distance

            if speed_kmh > 0 and self.start_ride_time == 0:
                self.start_ride_time = time.time()
            if self.start_ride_time > 0:
                time_elapsed = time.time() - self.start_ride_time
            else:
                time_elapsed = 0

            data = {
                'position': '%.3f' % self.curr_position,
                'speedKmh': '%.3f' % speed_kmh,
                'speedMs': '%.3f' % speed_ms,
                'timeElapsed': '%.3f' % time_elapsed}

            await websocket.send(json.dumps(data))
            # if self.curr_position >= self.distance:
            #     self.end_time = time.time()
            #     self.reset()


if __name__ == '__main__':
    try:
        port = sys.argv[1]
    except IndexError:
        port = PORT
    data_receiver = SerialDataReceiver(port)
    data_receiver.start()
    distance_meter = DistanceServer(data_receiver)
    distance_meter.start()

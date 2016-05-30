import asyncio
import logging
import sys
import time
from threading import Thread

import serial
import websockets

logging.basicConfig(level=logging.INFO)
logging.getLogger('websockets.protocol').setLevel(logging.INFO)
logger = logging.getLogger('')

PORT = '/dev/ttyACM0'  # USB port


def format_speed(value):
    return '%.2f km/h' % value


class SerialDataReceiver(object):
    BAUDRATE = 9600
    TIMEOUT = 0.1

    def __init__(self, port):
        self.current_speed = 0
        self.is_running = False
        self._port = port
        self._serial = None

    def start(self):
        try:
            self._serial = serial.Serial(self._port, self.BAUDRATE,
                                         timeout=self.TIMEOUT)
        except serial.SerialException:
            logger.error("Failed to connect to %s" % self._port)
        else:
            self.is_running = True
            t = Thread(target=self._run)
            t.start()
            logger.info("Started receiver from %s" % self._serial.name)

    def stop(self):
        self.is_running = False
        self._serial.close()

    def _run(self):
        while self.is_running:
            try:
                speed = self._serial.readline().strip()
            except serial.SerialException:
                speed = ''
            logger.debug("Received: %s" % speed)
            if speed:
                try:
                    self.current_speed = float(speed)
                except ValueError:
                    self.current_speed = 0
            else:
                self.current_speed = 0


class DistanceServer(object):
    TIME_PRECISION = 0.001

    def __init__(self, data_receiver):
        self.data_receiver = data_receiver
        self.is_running = False
        self.start_ride_time = 0
        self.end_time = 0
        self.distance = 100  # 100m
        self.curr_position = 0

    def start(self):
        self.is_running = True
        start_server = websockets.serve(self._run, 'localhost', 8765)
        logger.info("Starting websocket server")
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
        while self.is_running:
            await asyncio.sleep(interval)
            speed_kmh = self.data_receiver.current_speed
            speed_ms = speed_kmh / 3.6
            if speed_kmh > 0 and self.start_ride_time == 0:
                self.start_ride_time = time.time()
            curr_distance = speed_ms * interval
            self.curr_position += curr_distance
            if self.start_ride_time > 0:
                time_elapsed = time.time() - self.start_ride_time
            else:
                time_elapsed = 0

            data = b"%.2fm (%.2f km/h %.2f m/s) - %.3fs" % (self.curr_position, speed_kmh, speed_ms, time_elapsed)
            await websocket.send(data)
            logger.debug(data)

            if self.curr_position >= self.distance:
                self.end_time = time.time()
                self.reset()


if __name__ == '__main__':
    try:
        port = sys.argv[1]
    except IndexError:
        port = PORT
    data_receiver = SerialDataReceiver(port)
    data_receiver.start()
    distance_meter = DistanceServer(data_receiver)
    distance_meter.start()

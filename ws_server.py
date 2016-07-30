import asyncio
import json
import signal
import sys
import time

import serial
import websockets
from clint.textui import colored, puts

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
            puts("Failed to connect to %s" % self._port)
        else:
            puts("Start reading from %s" % self._serial.name)
            self._loop.add_reader(self._serial.fileno(), self.read_serial)
            server_task = websockets.serve(
                self.run_server, 'localhost', self.WEBSOCKET_PORT)
            self._loop.run_until_complete(server_task)
            self._loop.run_forever()
        finally:
            self._loop.close()
    
    def reset_speed(self):
        self.previous_a = 0
        self.previous_b = 0
        self.speed_a = 0
        self.speed_b = 0

    def validate_speed(self, speed, speed_prev):
        if speed == float('inf'):
            return False

        # This excludes too high measurments:
        # average - average speed of the current and previous measurements
        # ratio - acceleration ratio  
        if speed_prev > 0:
            average = (speed + speed_prev) / 2
            ratio = speed / average
            # puts("%s %s %s" % (speed, average, ratio))
            if ratio > 1.25:
                return False
        return True

    def read_serial(self):
        try:
            line = str(self._serial.readline().decode()).strip()
            puts("[Serial] %s" % line)
            player_id, speed = line.split('|')
            speed = float(speed)
            if player_id == PLAYER_A and self.validate_speed(speed, self.previous_a):
                self.previous_a = self.speed_a
                self.speed_a = speed
            elif player_id == PLAYER_B and self.validate_speed(speed, self.previous_b):
                self.previous_b = self.speed_b
                self.speed_b = speed
            else:
                puts(colored.red('Skipped line: %s' % line))
            self._last_read_time = time.time()
        except Exception as e:
            puts(colored.red("Error: %s" % e))
            self.reset_speed()

    async def run_server(self, websocket, path):
        puts("Start websocket server on %s" % self.WEBSOCKET_PORT)
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
            try:
                await websocket.send(json.dumps(data))
            except websockets.ConnectionClosed:
                puts("Connection closed")
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

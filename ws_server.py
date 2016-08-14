import asyncio
import json
import signal
import sys
import time
from collections import deque

import serial
import websockets
from clint.textui import colored, puts

PORT = '/dev/ttyACM0'  # USB port
PLAYER_A = 'a'
PLAYER_B = 'b'

WRITE_LOGFILE = False;


class Buffer(object):
    # Buffer size
    SIZE = 5

    # Maxiumum number of values to skip. If skipped MAX_SKIP values in row,
    # assume that the value is correct and allow it.
    MAX_SKIP = 5

    def __init__(self, *args, **kwargs):
        self._buffer = deque(maxlen=self.SIZE)
        self.skipped_count = 0

    def append(self, value):
        # Reject infinite value
        if value == float('inf'):
            return False

        # Check too high values
        avg = self.avg()
        if avg > 0 and self.skipped_count < self.MAX_SKIP:
            # under 20km/h check for values two times higher
            if value < 20 and value > avg * 2:
                self.skipped_count += 1
                return False
            elif value > 20 and value > avg * 1.5:
                self.skipped_count += 1
                return False

        # Value is ok, append to buffer
        self._buffer.append(value)
        self.skipped_count = 0
        return True

    def clear(self):
        self._buffer.clear()
        self._buffer.append(0)

    def avg(self):
        buffer_len = len(self._buffer)
        if buffer_len > 0:
            return sum(self._buffer) / buffer_len
        else:
            return 0


class SerialDataReceiver(object):
    BAUDRATE = 9600
    SERIAL_TIMEOUT = 0.1
    SERVER_PRECISION = 0.005
    VALID_DATA_TIMEOUT = 0.5
    WEBSOCKET_PORT = 8765

    def __init__(self, port):
        self._port = port
        self._serial = None
        self._last_read_time = 0
        self._loop = asyncio.get_event_loop()
        self._loop.add_signal_handler(getattr(signal, 'SIGINT'), self.stop)
        self._loop.add_signal_handler(getattr(signal, 'SIGTERM'), self.stop)
        self.buffer_a = Buffer()
        self.buffer_b = Buffer()

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

    def read_serial(self):
        try:
            # Parse line from serial
            line = str(self._serial.readline().decode()).strip()
            player_id, speed = line.split('|')
            speed = float(speed)

            # Append parsed value to appropriate buffer
            if player_id == PLAYER_A:
                is_appended = self.buffer_a.append(speed)
                log = "%s :: %s" % (line, self.buffer_a.avg())
            elif player_id == PLAYER_B:
                is_appended = self.buffer_b.append(speed)
                log = "%s :: %s" % (line, self.buffer_b.avg())
            else:
                puts(colored.red('No player ID: %s' % line))

            # Log status to console
            puts("[Serial] %s" % log)
            if not is_appended:
                puts(colored.red('Skipped line: %s' % line))

            self._last_read_time = time.time()
        except Exception as e:
            puts(colored.red("Error: %s" % e))
            # self.reset_speed()

    async def run_server(self, websocket, path):
        puts("Start websocket server on %s" % self.WEBSOCKET_PORT)
        interval = self.SERVER_PRECISION
        while True:
            await asyncio.sleep(interval)

            # Reset state if there were no values for longer than VALID_DATA_TIMEOUT
            if time.time() - self._last_read_time > self.VALID_DATA_TIMEOUT:
                self.reset_speed()

            # Send data to websocket
            data = {'speed_a': '%.3f' % (self.buffer_a.avg() / 3.6),
                    'speed_b': '%.3f' % (self.buffer_b.avg() / 3.6),
                    'interval': '%s' % interval}
            try:
                await websocket.send(json.dumps(data))
            except websockets.ConnectionClosed:
                puts("Connection closed")
                break

    def reset_speed(self):
        self.buffer_a.clear()
        self.buffer_b.clear()

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

import sys
from threading import Thread

import serial
import time

PORT = '/dev/ttyACM0'  # USB port


def format_speed(value):
    return '%.2f km/h' % value


class Speedometer(object):
    BAUDRATE = 9600

    def __init__(self, port):
        self.current_speed = 0
        self.is_running = False
        self._port = port
        self._serial = None

    def start(self):
        try:
            self._serial = serial.Serial(self._port, self.BAUDRATE, timeout=1)
        except serial.SerialException:
            print "Failed to connect to %s" % self._port
        else:
            print "Connected to: ", self._serial.name
            self.is_running = True
            t = Thread(target=self._run)
            t.start()

    def stop(self):
        print "Stop"
        self.is_running = False
        self._serial.close()

    def _run(self):
        while self.is_running:
            try:
                speed = self._serial.readline().strip()
            except serial.SerialException:
                speed = ''
            if speed:
                try:
                    # print format_speed(speed)
                    self.current_speed = float(speed)
                except ValueError:
                    self.current_speed = 0
            else:
                self.current_speed = 0


class Race(object):
    TIME_PRECISION = 0.001

    def __init__(self, speedometer):
        self.speedometer = speedometer
        self.is_running = False
        self.start_time = 0
        self.start_ride_time = 0
        self.end_time = 0
        self.distance = 100  # 100m
        self.curr_position = 0

    def start(self):
        self.is_running = True
        self.start_time = time.time()
        t = Thread(target=self._run)
        t.start()

    def stop(self):
        self.end_time = time.time()
        self.is_running = False
        print "Race time: ", self.end_time - self.start_time

    def _run(self):
        interval = self.TIME_PRECISION  # 0.01s = 10ms
        while self.is_running:
            time.sleep(interval)
            speed_kmh = self.speedometer.current_speed
            speed_ms = speed_kmh / 3.6
            if speed_kmh > 0 and self.start_ride_time == 0:
                print "Started"
                self.start_ride_time = time.time()
            curr_distance = speed_ms * interval
            self.curr_position += curr_distance
            if self.start_ride_time > 0:
                time_elapsed = time.time() - self.start_ride_time
            else:
                time_elapsed = 0
            print "%.2fm (%.2f km/h %.2f m/s) - %.3fs" % (self.curr_position, speed_kmh, speed_ms, time_elapsed)
            if self.curr_position >= self.distance:
                self.stop()


if __name__ == '__main__':
    try:
        port = sys.argv[1]
    except IndexError:
        port = PORT

    speedometer = Speedometer(port)
    speedometer.start()

    race = Race(speedometer)
    race.start()

    if speedometer.is_running:
        try:
            while True:
                time.sleep(.1)
        except KeyboardInterrupt:
            speedometer.stop()
            race.stop()

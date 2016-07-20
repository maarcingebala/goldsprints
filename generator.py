import sys
import random
import time
from threading import Thread

import serial
from clint.textui import puts, colored

color_f = {
    'a': colored.red,
    'b': colored.blue
}


class SpeedGenerator(object):

    def __init__(self, generator_id, initial_speed, port, randomize=False):
        self.generator_id = generator_id
        self.out_f = color_f[self.generator_id]
        self.port = port
        self.initial_speed = initial_speed
        self.randomize = randomize

    def start(self):
        t = Thread(target=self._run)
        t.start()

    def _run(self):
        output = serial.Serial(port)
        print("Generating data on %s" % output.name)
        while True:
            v = self.initial_speed
            if self.randomize:
                v += -0.5 + random.random()
            interval = 1 / v
            output.write(('%s|%.2f\n' % (self.generator_id, v)).encode())
            puts(self.out_f('%s|%.2f' % (self.generator_id, v)))
            time.sleep(interval)


if __name__ == '__main__':
    try:
        port = sys.argv[1]
    except IndexError:
        print("No port given")
        sys.exit(0)

    try:
        speed_1 = int(sys.argv[2])
    except IndexError:
    	speed_1 = 0
    try:
        speed_2 = int(sys.argv[3])
    except IndexError:
        speed_2 = 0

    gen_a = SpeedGenerator('a', speed_1, port)
    gen_b = SpeedGenerator('b', speed_2, port)

    if speed_1 > 0:
        gen_a.start()
    if speed_2 > 0:
        gen_b.start()

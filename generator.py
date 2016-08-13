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


class RandomGenerator(object):

    def __init__(self, port, generator_id, initial_speed=0,  randomize=False):
        self.generator_id = generator_id
        self.port = port
        self.initial_speed = initial_speed
        self.randomize = randomize
        self.out_f = color_f[self.generator_id]

    def start(self):
        t = Thread(target=self._run)
        t.start()
    
    def get_output(self):
        output = serial.Serial(self.port)
        print("Generating data on %s" % output.name)
        return output
    
    def write_to_out(self, output, player_id, v):
        output.write(('%s|%.2f\n' % (player_id, v)).encode())
        puts(self.out_f('%s|%.2f' % (player_id, v)))

    def _run(self):
        output = self.get_output()
        temp_changed_v = self.initial_speed
        while True:
            v = temp_changed_v
            if self.randomize:
                if random.random() > 1:
                    # simulate random invalid values
                    v += 100
                elif random.random() > 0.85:
                    temp_changed_v += 10 * (-0.5 + random.random())
                    if random.random() > 0.85:
                        temp_changed_v = self.initial_speed

            interval = 1 / v
            self.write_to_out(output, self.generator_id, v)
            time.sleep(interval)


class LogfileGenerator(RandomGenerator):
    
    def __init__(self, filename, *args, **kwargs):
        self.filename = filename
        super(LogfileGenerator, self).__init__(*args, **kwargs)
    
    def _run(self):
        output = self.get_output()
        source = open(self.filename, 'r')
        for line in source.readlines():
            line = line.strip()
            player_id, v = line.split('|')
            if player_id == self.generator_id:
                v = float(v)
                if v > 1:
                    interval = 1 / v
                else:
                    interval = 1
                self.write_to_out(output, player_id, v)
                time.sleep(interval)
        source.close()


if __name__ == '__main__':
    try:
        port = sys.argv[1]
    except IndexError:
        print("No port given")
        sys.exit(0)

    # Random generator
    randomize = False
    try:
        speed_1 = int(sys.argv[2])
    except IndexError:
    	speed_1 = 0
    try:
        speed_2 = int(sys.argv[3])
    except IndexError:
        speed_2 = 0
    gen_a = RandomGenerator(port, 'a', speed_1, randomize)
    gen_b = RandomGenerator(port, 'b', speed_2, randomize)
    if speed_1 > 0:
        gen_a.start()
    if speed_2 > 0:
        gen_b.start()


    ## Logfile Generator
    # try:
    #     filename = sys.argv[2]
    # except IndexError:
    #     print("No logfile given")
    #     sys.exit(0)
    # gen_a = LogfileGenerator(filename, port, 'a')
    # gen_b = LogfileGenerator(filename, port, 'b')
    # gen_a.start()
    # gen_b.start()

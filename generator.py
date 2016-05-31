import sys
import random
import time
import serial


if __name__ == '__main__':
    try:
        port = sys.argv[1]
    except IndexError:
        print("No port given")
        sys.exit(0)
    ser = serial.Serial(port)

    speed_values = [1.0, 2., 3., 4., 5., 6., 7., 9., 10., 11., 13., 15.]
    # speed_values = [10.0, 15.0, 18.0, 20.0, 25.0, 20.0, 16.0, 11.0]
    # speed_values = [3.0, 7.0, 9.0, 12.0, 15.0, 17.0, 20.0, 24.0, 25.0, 26.0, 27.0]
    randomize = True

    i = 0
    v = speed_values[i]
    counter = 0

    print("Generating data on %s" % ser.name)
    while True:
        try:
            v = speed_values[i]
        except IndexError:
            i = len(speed_values) - 1
        else:
            if randomize:
                v += -0.5 + random.random()
            interval = 1 / v
            ser.write(b'%.2f\n' % v)
            print('%.2f' % v)
            counter += 1
            if counter >= 5:
                counter = 0
                i += 1
            time.sleep(interval)

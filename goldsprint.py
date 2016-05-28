import serial

BAUDRATE = 9600
PORT = '/dev/ttyACM0'


def connect():
    try:
        ser = serial.Serial(PORT, BAUDRATE, timeout=1)
    except serial.SerialException:
        print "Failed to connect to %s" % PORT
    else:
        print "Connected to: ", ser.name
        try:
            while True:
                speed = ser.readline().strip()
                if speed:
                    print "%s km/h" % speed
        except KeyboardInterrupt:
            ser.close()
            print "Closed connection"


if __name__ == '__main__':
    connect()

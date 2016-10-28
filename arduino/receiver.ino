// constants
double wheelPerimeter = 2.13;
double msToKmh = 3.6;
double rollerToBicycleWheel = 6.196364;

// variables
double rpmRollerA;
double rpmBicycleA;
double rpmRollerB;
double rpmBicycleB;
double speedA;
double speedB;
double lastmillisA;
double lastmillisB;

volatile int counterA = 0;  // revolutions counter for bike A
volatile int counterB = 0;  // revolutions counter for bike B

double countSignalsA = 0;
double countSignalsB = 0;


// pins
int vccA = 8;
int vccB = 9;

// https://www.arduino.cc/en/Reference/attachInterrupt
int sensorA = 0;  // interrupt 0 -> pin 2 (Arduino Uno)
int sensorB = 1;  // interrupt 1 -> pin 3 (Arduino Uno)


void setup() {
  // setup bike A
  pinMode(vccA, OUTPUT);  
  digitalWrite(vccA, HIGH);
  attachInterrupt(sensorA, onSignalA, RISING);

  // setup bike B
  pinMode(vccB, OUTPUT);
  digitalWrite(vccB, HIGH);
  attachInterrupt(sensorB, onSignalB, RISING);

  // setup serial
  Serial.begin(9600);
}

void loop() {
  if (counterA >= 1 ) {
    speedA = calcSpeed(counterA, lastmillisA);
    printLine('a', speedA);
    lastmillisA = millis();
    counterA = 0;
  }

  if (counterB >= 1 ) {
    speedB = calcSpeed(counterB, lastmillisB);
    printLine('b', speedB);
    lastmillisB = millis();
    counterB = 0;
  }
}


double calcSpeed(int signalsCounter, double lastMillis) {
  double rollerRev = (signalsCounter / ((millis() - lastMillis) * 0.001));
  double wheelRev = rollerRev / rollerToBicycleWheel;
  double speed = wheelRev * wheelPerimeter;
  return speed;
}


void printLine(char id, double speed) {
  Serial.print(id);
  Serial.print("|");
  Serial.println(speed);
}


void onSignalA() {
  counterA++;
  // countSignalsA++;
}

void onSignalB() {
  counterB++;
  // countSignalsB++;
}
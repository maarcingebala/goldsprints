// constants
double circuitWheel = 2.13;
double msToKmh = 3.6;
double rollerToBicycleWheel = 6.196364;

// variables
double rpmRollerA;
double rpmBicycleA;
double rpmRollerB;
double rpmBicycleB;
double speedA;
double speedB;
double lastmillisFirst;
double lastmillisSecond;

volatile int counterA = 0;  // revolutions counter for bike A
volatile int counterB = 0;  // revolutions counter for bike B


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
    rpmRollerA = (counterA / ((millis() - lastmillisFirst) * 0.001));
    rpmBicycleA = rpmRollerA / rollerToBicycleWheel;
    speedA = rpmBicycleA * circuitWheel * msToKmh ;

    lastmillisFirst = millis();
    Serial.print("a|");
    Serial.println(speedA);
    counterA = 0;
  }

  if (counterB >= 1 ) {
    rpmRollerB = (counterB / ((millis() - lastmillisSecond) * 0.001));
    rpmBicycleB = rpmRollerB / rollerToBicycleWheel;
    speedB = rpmBicycleB * circuitWheel * msToKmh;

    lastmillisSecond = millis();
    Serial.print("b|");
    Serial.println(speedB);
    counterB = 0;
  }
}


void onSignalA() {
  counterA++;
}

void onSignalB() {
  counterB++;
}
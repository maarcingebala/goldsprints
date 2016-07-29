volatile int revolutionsFirstPlayer = 0;
volatile int revolutionsSecondPlayer= 0;
double wheelcirc = 2.13;
double rollerToBicycleWheel = 6.196364;
double circuitWheel = 2.13;
double meterPerSecondToKmPerHour = 3.6;
double rpmRollerFirstPlayer;
double rpmBicycleFirstPlayer;
double rpmRollerSecondPlayer;
double rpmBicycleSecondPlayer;
double bicycleSpeedFirstPlayer;
double bicycleSpeedSecondPlayer;
double lastmillis;


void setup() {
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
  Serial.begin(9600);
  digitalWrite(8, HIGH);
  digitalWrite(9, HIGH);
  attachInterrupt(0, rpm_bicycle, RISING);
  attachInterrupt(1, rpm_bicycle2, RISING);
}

void loop() {
 if (revolutionsFirstPlayer >= 1 ) {
   rpmRollerFirstPlayer = (revolutionsFirstPlayer / ((millis() - lastmillis) * 0.001));
   rpmBicycleFirstPlayer = rpmRollerFirstPlayer / rollerToBicycleWheel;
   bicycleSpeedFirstPlayer = rpmBicycleFirstPlayer * circuitWheel * meterPerSecondToKmPerHour ;
   lastmillis = millis();
   Serial.print("a|");
   Serial.println(bicycleSpeedFirstPlayer);
   revolutionsFirstPlayer = 0;
 }
  if (revolutionsSecondPlayer >= 1 ) {
   rpmRollerSecondPlayer = (revolutionsSecondPlayer / ((millis() - lastmillis) * 0.001));
   rpmBicycleFirstPlayer = rpmRollerFirstPlayer / rollerToBicycleWheel;
   bicycleSpeedSecondPlayer = rpmBicycleSecondPlayer * circuitWheel * meterPerSecondToKmPerHour;
   lastmillis = millis();
   Serial.print("b|");
   Serial.println(bicycleSpeedSecondPlayer);
   revolutionsSecondPlayer = 0;
 }
}


void rpm_bicycle() {
 revolutionsFirstPlayer++;
}

void rpm_bicycle2() {
 revolutionsSecondPlayer++;
}
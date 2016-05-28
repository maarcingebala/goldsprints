volatile int revolutions = 0;
float bikespeed;
double wheelcirc = 2.13;
double rpm;
double rpmB;
double vbi;
double lastmillis;

void setup() {
  pinMode(8, OUTPUT);
  Serial.begin(9600);
  digitalWrite(8, HIGH);
  attachInterrupt(0, rpm_bicycle, RISING);
}

void loop() {
 if (revolutions >= 1 ) {
   rpm = (revolutions / ((millis() - lastmillis) * 0.001));
   rpmB = rpm / 6.196364;
   vbi = rpmB * 2.13 * 3.6;
   lastmillis = millis();
   Serial.println(vbi);
   revolutions = 0;
 }
}

void rpm_bicycle() {
 revolutions++;
}

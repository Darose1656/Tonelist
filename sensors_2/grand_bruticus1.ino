// Define the pins
const int pirPin = 2;    // PIR sensor output pin
const int motorPin = 3;  // Pin controlling the transistor (and thus the motor)

// Variable to store the PIR sensor state
int pirState = LOW;

void setup() {
  // Set the PIR pin as input
  pinMode(pirPin, INPUT);
  
  // Set the motor pin as output
  pinMode(motorPin, OUTPUT);
  
  // Start with the motor off
  digitalWrite(motorPin, LOW);
  
  // Initialize serial communication for debugging (optional)
  Serial.begin(9600);
}

void loop() {
  // Read the state of the PIR sensor
  pirState = digitalRead(pirPin);
  
  // Check if motion is detected
  if (pirState == HIGH) {
    // Motion detected, pulse the motor to create a "buzzing" effect
    Serial.println("Motion detected! Motor ON");
    for (int i = 0; i < 5; i++) { // Pulse 5 times
      digitalWrite(motorPin, HIGH);  // Turn motor on
      delay(1000);                    // On for 1s
      digitalWrite(motorPin, LOW);   // Turn motor off
      delay(200);                    // Off for 200ms
    }
  } else {
    // No motion, keep the motor off
    digitalWrite(motorPin, LOW);
    Serial.println("No motion. Motor OFF");
  }
  
  // Small delay to avoid flooding the serial monitor
  delay(100);
}
#include <Arduino.h>
#include <HID-Project.h>
#include <EEPROM.h>
#include <ArduinoJson.h>
#define EEPROM_MAGIC 0x1234

void checkButtonStates(struct buttonStates* states, struct buttonMappings* mappings);
void buttonPress(int buttonState, int buttonMapping, int gpButton, int buttonIndex);
void saveToEEPROM();
bool loadFromEEPROM();

//constants for button indices
#define BUTTON_RED 0
#define BUTTON_YELLOW 1
#define BUTTON_GREEN 2
#define BUTTON_BLUE 3
#define BUTTON_WHITE 4
#define BUTTON_JOY_UP 5
#define BUTTON_JOY_DOWN 6
#define BUTTON_JOY_LEFT 7
#define BUTTON_JOY_RIGHT 8
#define NUM_BUTTONS 9

struct buttonMappings {
    //colored buttons
    int redButtonMapping;
    int yellowButtonMapping;
    int greenButtonMapping;
    int blueButtonMapping;
    int whiteButtonMapping;

    //joystick buttons
    int upMapping;
    int downMapping;
    int rightMapping;
    int leftMapping;
};

struct buttonStates {
    //colored buttons
    int redButtonState;
    int yellowButtonState;
    int blueButtonState;
    int greenButtonState;
    int whiteButtonState;

    //joystick buttons
    int upState;
    int downState;
    int rightState;
    int leftState;
};

buttonMappings allMappings;
bool gamepadMode = false;

void setup() {
    //initialize HID libraries
    Keyboard.begin();
    Gamepad.begin();

    //start serial communication for receiving JSON
    Serial.begin(9600);

    //load previous configuration
    bool eepromLoaded = loadFromEEPROM();

    if (!eepromLoaded) {
        Serial.println("Couldn't find valid EEPROM data. Using default settings.");
        // Set default configurations here
        allMappings.redButtonMapping = KEY_A;
        allMappings.yellowButtonMapping = KEY_S;
        allMappings.greenButtonMapping = KEY_D;
        allMappings.blueButtonMapping = KEY_F;
        allMappings.whiteButtonMapping = KEY_G;
        allMappings.upMapping = KEY_UP_ARROW;
        allMappings.downMapping = KEY_DOWN_ARROW;
        allMappings.leftMapping = KEY_LEFT_ARROW;
        allMappings.rightMapping = KEY_RIGHT_ARROW;
        gamepadMode = false;
    }

    //set digital outputs based on loaded gamepadMode
    pinMode(A0, OUTPUT);  //set pin A0 as output
    pinMode(A1, OUTPUT);  //set pin A1 as output
    if (gamepadMode) {
        digitalWrite(A1, HIGH);
        digitalWrite(A0, LOW);
    } else {
        digitalWrite(A0, HIGH);
        digitalWrite(A1, LOW);
    }

    //set pins for buttons and joysticks
    pinMode(2, INPUT_PULLUP); //joy up
    pinMode(3, INPUT_PULLUP); //joy left
    pinMode(4, INPUT_PULLUP); //joy down
    pinMode(5, INPUT_PULLUP); //joy right
    pinMode(6, INPUT_PULLUP); //button red
    pinMode(7, INPUT_PULLUP); //button blue
    pinMode(8, INPUT_PULLUP); //button green
    pinMode(9, INPUT_PULLUP); //button white
    pinMode(10, INPUT_PULLUP); //button yellow

    Serial.println("Setup complete. Running with current configuration.");
    Serial.println("Send new JSON configuration at any time to update settings.");

}

void loop() {
    //check for new serial input
    if (Serial.available()) {
        String jsonInput = Serial.readStringUntil('\n');

        //allocate memory for the json document
        JsonDocument jsonDoc;  //adjust size as needed

        //parse JSON
        DeserializationError error = deserializeJson(jsonDoc, jsonInput);
        if (error) {
            Serial.print(F("Failed to parse JSON: "));
            Serial.println(error.f_str());
            //if parsing fails, continue with existing configuration
        } else {
            Serial.println("JSON configuration successfully imported");

            //set button mappings from JSON object
            allMappings.redButtonMapping = jsonDoc["redButton"].as<int>();
            allMappings.yellowButtonMapping = jsonDoc["yellowButton"].as<int>();
            allMappings.greenButtonMapping = jsonDoc["greenButton"].as<int>();
            allMappings.blueButtonMapping = jsonDoc["blueButton"].as<int>();
            allMappings.whiteButtonMapping = jsonDoc["whiteButton"].as<int>();

            //set joystick mappings
            allMappings.upMapping = jsonDoc["up"].as<int>();
            allMappings.downMapping = jsonDoc["down"].as<int>();
            allMappings.rightMapping = jsonDoc["right"].as<int>();
            allMappings.leftMapping = jsonDoc["left"].as<int>();

            //set gamepad mode
            if (jsonDoc["gamepadMode"].as<int>() == 1) {
                gamepadMode = true;
                Serial.println("Gamepad mode active!");
                digitalWrite(A1, HIGH);
                digitalWrite(A0, LOW);
            } else {
                gamepadMode = false;
                Serial.println("Keyboard mode active!");
                digitalWrite(A0, HIGH);
                digitalWrite(A1, LOW);
            }

            //save new configuration to eeprom
            saveToEEPROM();
            Serial.println(F("New configuration processed and saved to EEPROM."));
        }

        //clear any remaining data in the serial buffer
        while (Serial.available()) {
            Serial.read();
        }
    }

    //main operation code
    //static button states, allocated only once
    static buttonStates allStates;

    //get states of joystick
    allStates.upState = digitalRead(2);
    allStates.downState = digitalRead(4);
    allStates.rightState = digitalRead(5);
    allStates.leftState = digitalRead(3);

    //get states of all buttons
    allStates.redButtonState = digitalRead(6);
    allStates.yellowButtonState = digitalRead(10);
    allStates.greenButtonState = digitalRead(8);
    allStates.blueButtonState = digitalRead(7);
    allStates.whiteButtonState = digitalRead(9);

    checkButtonStates(&allStates, &allMappings);

    //if in gamepad mode, send X and Y axis values
    if (gamepadMode) {
        int xAxis = 0;  //joystick horizontal movement
        int yAxis = 0;  //joystick vertical movement

        //handle joystick movements
        if (allStates.leftState == LOW) {
            xAxis = -32767;  //full left
        } else if (allStates.rightState == LOW) {
            xAxis = 32767;   //full right
        }

        if (allStates.upState == LOW) {
            yAxis = 32767;  //full up
        } else if (allStates.downState == LOW) {
            yAxis = -32767;   //full down
        }

        //set gamepad axes
        Gamepad.xAxis(xAxis);
        Gamepad.yAxis(yAxis);

        //write the gamepad report
        Gamepad.write();
    }

}

void checkButtonStates(struct buttonStates* states, struct buttonMappings* mappings) {
    //define gamepad button indices
    int gamepadRedButton = 2;
    int gamepadYellowButton = 4;
    int gamepadGreenButton = 1;
    int gamepadBlueButton = 3;
    int gamepadWhiteButton = 10;

    //set button presses with unique button indices
    buttonPress(states->redButtonState, mappings->redButtonMapping, gamepadRedButton, BUTTON_RED);
    buttonPress(states->yellowButtonState, mappings->yellowButtonMapping, gamepadYellowButton, BUTTON_YELLOW);
    buttonPress(states->greenButtonState, mappings->greenButtonMapping, gamepadGreenButton, BUTTON_GREEN);
    buttonPress(states->blueButtonState, mappings->blueButtonMapping, gamepadBlueButton, BUTTON_BLUE);
    buttonPress(states->whiteButtonState, mappings->whiteButtonMapping, gamepadWhiteButton, BUTTON_WHITE);

    //set joystick positions (as buttons) with unique indices
    buttonPress(states->upState, mappings->upMapping, 0, BUTTON_JOY_UP);
    buttonPress(states->downState, mappings->downMapping, 0, BUTTON_JOY_DOWN);
    buttonPress(states->rightState, mappings->rightMapping, 0, BUTTON_JOY_RIGHT);
    buttonPress(states->leftState, mappings->leftMapping, 0, BUTTON_JOY_LEFT);

}

void buttonPress(int buttonState, int buttonMapping, int gpButton, int buttonIndex) {
    static bool buttonPressed[NUM_BUTTONS] = {false}; // Adjust size based on number of buttons

    if (gamepadMode && gpButton > 0) {
        if (buttonState == LOW && !buttonPressed[buttonIndex]) {
            //button is pressed
            Gamepad.press(gpButton);
            buttonPressed[buttonIndex] = true;
        } else if (buttonState == HIGH && buttonPressed[buttonIndex]) {
            //button is released
            Gamepad.release(gpButton);
            buttonPressed[buttonIndex] = false;
        }
    } else {
        if (buttonState == LOW && !buttonPressed[buttonIndex]) {
            //button is pressed
            Keyboard.press(buttonMapping);
            buttonPressed[buttonIndex] = true;
        } else if (buttonState == HIGH && buttonPressed[buttonIndex]) {
            //button is released
            Keyboard.release(buttonMapping);
            buttonPressed[buttonIndex] = false;
        }
    }

}

void saveToEEPROM() {
    //save each button mapping to EEPROM
    EEPROM.put(0, allMappings.redButtonMapping);
    EEPROM.put(2, allMappings.yellowButtonMapping);
    EEPROM.put(4, allMappings.greenButtonMapping);
    EEPROM.put(6, allMappings.blueButtonMapping);
    EEPROM.put(8, allMappings.whiteButtonMapping);

    //save joystick mappings
    EEPROM.put(10, allMappings.upMapping);
    EEPROM.put(12, allMappings.downMapping);
    EEPROM.put(14, allMappings.rightMapping);
    EEPROM.put(16, allMappings.leftMapping);

    //save gamepad mode
    EEPROM.put(18, gamepadMode);

    //save magic number
    EEPROM.put(20, EEPROM_MAGIC);
}

bool loadFromEEPROM() {
    //check if the magic number is present
    uint16_t magic;
    EEPROM.get(20, magic);
    if (magic != EEPROM_MAGIC) {
        //magic number not found
        Serial.println(F("No valid EEPROM data found."));
        return false;
    }

    //load button mappings
    EEPROM.get(0, allMappings.redButtonMapping);
    EEPROM.get(2, allMappings.yellowButtonMapping);
    EEPROM.get(4, allMappings.greenButtonMapping);
    EEPROM.get(6, allMappings.blueButtonMapping);
    EEPROM.get(8, allMappings.whiteButtonMapping);

    //load joystick mappings
    EEPROM.get(10, allMappings.upMapping);
    EEPROM.get(12, allMappings.downMapping);
    EEPROM.get(14, allMappings.rightMapping);
    EEPROM.get(16, allMappings.leftMapping);

    //load gamepad mode
    EEPROM.get(18, gamepadMode);
    return true;

}
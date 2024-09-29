# OpenController

Offering an affordable, open way for people with disabilities to enjoy the games they love.



## Installation

### Prerequisites

- **Node.js**: Download and install Node.js from [here](https://nodejs.org/).
- **PlatformIO**: Download and install PlatformIO (Core or IDE is fine) from [here](https://platformio.org/).
- **Arduino Micro**: Grab an Arduino Micro from [here](https://store.arduino.cc/products/arduino-micro).
     - You should be able to use any off-the-shelf button or joystick, provided that it's compatible with the Arduino Micro. Be sure to connect the pins according to the pins in `arduino-code/src/main.cpp`.

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/RamenBuddha/SH24.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd SH24
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Build and run Arduino code**
```
cd arduino_prog
pio run -e micro -t upload
```

## Usage

1. **Start the development server**:
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`.

2. **Build for production**:
   ```bash
   npm run build
   ```

**(Optional)**
If you'd like an easy way to experience the software/development environment, run
```bash
npm run dev
```
The app will be usable at `http://localhost:5173/` or other destinations specified in the terminal.

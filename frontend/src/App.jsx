import Navbar from './components/Navbar'
import Button from './components/Button'
import Joystick from './components/Joystick'
import Key from './components/Key'
import MessageContext from './components/MessageContext'
import GamepadMode from './components/Gamepad'
import { useState } from 'react'

let port;

function App() {
  const [styleProps, setStyleProps] = useState({
    right: '0px',
    top: '32px',
    left: '31px',
    bottom: '0px',
  });

  const handleDownArrowPress = () => {
    setStyleProps({
      right: '0px',
      top: '70px',
      left: '31px',
      bottom: '0px'
    });
  };
  const handleUpArrowPress = () => {
    setStyleProps({
      right: '0px',
      top: '-5px',
      left: '31px',
      bottom: '0px'
    });
  };
  const handleLeftArrowPress = () => {
    setStyleProps({
      right: '0px',
      top: '32px',
      left: '-5px',
      bottom: '0px'
    });
  };
  const handleRightArrowPress = () => {
    setStyleProps({
      right: '0px',
      top: '32px',
      left: '70px',
      bottom: '0px'
    });
  };
  let keys = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
    "`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "{", "}", "\\", "|", ";", ":", "'", "\"", ",", ".", "/", "<", ">", "?",
    "Enter", "BKSP", "Tab", "Esc", "Space",
    "Up", "Down", "Left", "Right",
    "Ctrl", "Alt", "Shift", "Win",
    "Caps",
  ];

  let asciiVals = {
    "A": 65,
    "B": 66,
    "C": 67,
    "D": 68,
    "E": 69,
    "F": 70,
    "G": 71,
    "H": 72,
    "I": 73,
    "J": 74,
    "K": 75,
    "L": 76,
    "M": 77,
    "N": 78,
    "O": 79,
    "P": 80,
    "Q": 81,
    "R": 82,
    "S": 83,
    "T": 84,
    "U": 85,
    "V": 86,
    "W": 87,
    "X": 88,
    "Y": 89,
    "Z": 90,
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,
    "`": 96,
    "~": 126,
    "!": 33,
    "@": 64,
    "#": 35,
    "$": 36,
    "%": 37,
    "^": 94,
    "&": 38,
    "*": 42,
    "(": 40,
    ")": 41,
    "-": 45,
    "_": 95,
    "=": 61,
    "+": 43,
    "[": 91,
    "]": 93,
    "{": 123,
    "}": 125,
    "\\": 92,
    "|": 124,
    ";": 59,
    ":": 58,
    "'": 39,
    "\"": 34,
    ",": 44,
    ".": 46,
    "/": 47,
    "<": 60,
    ">": 62,
    "?": 63,
    "Enter": 13,
    "Return": 13,
    "BKSP": 8,
    "Tab": 9,
    "Esc": 27,
    "Space": 32,
    "Up": 218,
    "Down": 217,
    "Left": 216,
    "Right": 215,
    "Home": 36,
    "End": 35,
    "PageUp": 33,
    "PageDown": 34,
    "Ctrl": 17,
    "Alt": 18,
    "Shift": 16,
    "Win": 131, // Windows key or Command key
    "Caps": 20,
    "NumLock": 144,
    "ScrollLock": 145,
    "PrintScreen": 44,
    "Insert": 45,
    "Delete": 46,
    "Pause": 19,
    "F1": 112,
    "F2": 113,
    "F3": 114,
    "F4": 115,
    "F5": 116,
    "F6": 117,
    "F7": 118,
    "F8": 119,
    "F9": 120,
    "F10": 121,
    "F11": 122,
    "F12": 123
  };

  const findVal = (obj, value) => {
    const entry = Object.entries(obj).find(([key, val]) => val === value);
    return entry ? entry[0] : null;
  }

  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const keyChunks = chunkArray(keys, 4);
  const [message, setMessage] = useState('');
  const [listeningButton, setListeningButton] = useState(null);
  const [gamepadMode, setgamepadMode] = useState(false);

  // Create buttons including arrow buttons
  const [buttons, setButtons] = useState(
    [{ id: "redButton", bind: 0 },
    { id: "greenButton", bind: 0},
    { id: "yellowButton", bind: 0},
    { id: "blueButton", bind: 0},
    { id: "whiteButton", bind: 0},
    { id: "up", bind: 0},
    { id: "down", bind: 0},
    { id: "left", bind: 0},
    { id: "right", bind: 0}
    ]
  );

  const createData = () =>{
    const data = buttons.reduce((acc, button) => {
      acc[button.id] = button.bind; 
      return acc;
    }, {});
    data.gamepadMode = gamepadMode ? 1 : 0;
    console.log(data)
    return data;
  }
 

  const createButtonsJson = () => {
    const data = createData();
    const jsonData = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);


    const a = document.createElement("a");
    a.href = url;
    a.download = "buttons_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendToDevice = async (jsonData) => {
    try {
      // If the port hasn't been requested yet, request it
      if (!port) {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });
      } else if (!port.readable || !port.writable) {
        // If the port exists but isn't open, open it
        await port.open({ baudRate: 9600 });
      }
  
      const jsonString = JSON.stringify(jsonData) + '\n'; // Ensure newline character
      const encoder = new TextEncoder();
      const writer = port.writable.getWriter();
      await writer.write(encoder.encode(jsonString));
      writer.releaseLock();
      // Do NOT close the port here; keep it open for future communications
    } catch (error) {
      console.error('Error during serial communication:', error);
    }
  };


const updateButtonBind = (id, newBind) => {
  setButtons((prevButtons) =>
    prevButtons.map((button) =>
      button.id === id ? { ...button, bind: asciiVals[newBind] } : button 
    )
  );
};

const updateArrowButtonBind = (id, newBind) => {
  setarrowButtons((prevArrowButtons) =>
    prevArrowButtons.map((arrowButton) =>
      arrowButton.id === id ? { ...arrowButton, bind: asciiVals[newBind] } : arrowButton
    )
  );
};



  return (
    <>
      <MessageContext.Provider value={{ createData, sendToDevice, createButtonsJson, message, setMessage }}>
        <Navbar />
        <div id="topDiv" className="w-screen h-[50vh] bg-white flex justify-evenly items-center">
          <div className="relative flex flex-col justify-center items-center">
            {/* Arrow Controls */}
            <div className="relative flex items-center justify-center" style={{ height: '200px', width: '200px' }}>
              <Joystick styleProps={styleProps}></Joystick>
              {/* Arrow Buttons Positioned Around Joystick with more spacing */}
              <div className="absolute" style={{ top: '-36px' }}>
                <Button
                  onClick={handleUpArrowPress}
                  key="up"
                  id="up"
                  bind={findVal(asciiVals, buttons.find(b => b.id === "up").bind)}
                  isListening={listeningButton === "up"}
                  setListeningButton={setListeningButton}
                  updateButtonBind={updateButtonBind}
                />
              </div>
              <div className="absolute" style={{ bottom: '-36px' }}>
                <Button
                  onClick={handleDownArrowPress}
                  key="down"
                  id="down"
                  bind={findVal(asciiVals, buttons.find(b => b.id === "down").bind)}
                  isListening={listeningButton === "down"}
                  setListeningButton={setListeningButton}
                  updateButtonBind={updateButtonBind}
                />
              </div>
              <div className="absolute" style={{ left: '-36px' }}> {/* Left Arrow with extra space */}
                <Button
                  onClick={handleLeftArrowPress}

                  key="left"
                  id="left"
                  bind={findVal(asciiVals, buttons.find(b => b.id === "left").bind)}
                  isListening={listeningButton === "left"}
                  setListeningButton={setListeningButton}
                  updateButtonBind={updateButtonBind}
                />
              </div>

              <div className="absolute" style={{ right: '-36px' }}> {/* Right Arrow with extra space */}
                <Button
                  onClick={handleRightArrowPress}

                  key="right"
                  id="right"
                  bind={findVal(asciiVals, buttons.find(b => b.id === "right").bind)}
                  isListening={listeningButton === "right"}
                  setListeningButton={setListeningButton}
                  updateButtonBind={updateButtonBind}
                />
              </div>
            </div>
          </div>
          <div className='flex flex-col items-center'>
          <GamepadMode
        bind={gamepadMode}
        toggleGamepadMode={() => setgamepadMode(!gamepadMode)}></GamepadMode>
          </div>
          <div className='grid grid-rows-2 grid-cols-3 gap-4'>
            {buttons.filter(button => !["left", "right", "down", "up"].includes(button.id)).map((button) => (
              <Button
                key={button.id}
                id={button.id}
                bind={findVal(asciiVals, button.bind)}
                isListening={listeningButton === button.id}
                setListeningButton={setListeningButton}
                updateButtonBind={updateButtonBind}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center w-screen h-[50vh] bg-slate-300 space-x-1">
          {keyChunks.map((chunk, index) => (
            <div key={index} className="flex flex-col">
              {chunk.map((key) => (
                <Key label={key} key={key} />
              ))}
            </div>
          ))}
        </div>
      </MessageContext.Provider >
    </>
  );
}

export default App;

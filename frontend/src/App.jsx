import Navbar from './components/Navbar'
import Button from './components/Button'
import Joystick from './components/Joystick'
import Key from './components/Key'
import MessageContext from './components/MessageContext'
import { getObjectFromCookie, setObjectAsCookie } from './scripts/cookies'
import { useState } from 'react'
import Arrowdown from './components/Arrowdown'
import Arrowleft from './components/Arrowleft'
import Arrowright from './components/Arrowright'
import Arrowtop from './components/Arrowtop'

function App() {
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

  const restore = getObjectFromCookie("c");
  const [buttons, setButtons] = useState(restore != null ? restore : [
    { id: "redButton", bind: "N/A" },
    { id: "greenButton", bind: "N/A" },
    { id: "yellowButton", bind: "N/A" },
    { id: "blueButton", bind: "N/A" },
    { id: "whiteButton", bind: "N/A" },
  ]);

  const createData = () => {
    const data = buttons.reduce((acc, button) => {
      acc[button.id] = button.bind;
      return acc;
    }, {});
    return data;
  }

  const createButtonsJson = () => {
    const data = createData();
    let go = true;
    data.forEach(([key, val]) => {
      if (val === "N/A") {
        go = false;
      }
    });
    if (go) {
      const jsonData = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);


      const a = document.createElement("a");
      a.href = url;
      a.download = "buttons_data.json";
      a.click();
      URL.revokeObjectURL(url);
    }
    else {
      console.log("Please fill out all binds!")
    }
  };

  const sendToDevice = async (jsonData) => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      const jsonString = JSON.stringify(jsonData);
      const encoder = new TextEncoder();
      const writer = port.writable.getWriter();
      await writer.write(encoder.encode(jsonString));
      writer.releaseLock();
      await port.close();
    } catch (error) {
      console.error('Error during serial communication:', error);
    }
  }

  const updateButtonBind = (id, newBind) => {
    setButtons((prevButtons) => {
      const updatedButtons = prevButtons.map((button) =>
        button.id === id ? { ...button, bind: asciiVals[newBind] } : button
      );
      setObjectAsCookie("c", updatedButtons);
      return updatedButtons;
    });
  };

  return (
    <>
      <MessageContext.Provider value={{ createData, sendToDevice, createButtonsJson, message, setMessage }}>
        <Navbar></Navbar>
        <div id="topDiv" className="w-screen h-[50vh] bg-white flex justify-evenly items-center">
          <div className="relative flex flex-col justify-center items-center">
            {/* Arrow Controls */}
            <div className="flex flex-col items-center justify-center">
              {/* Top Arrow */}
              <Arrowtop />

              <div className="flex justify-center items-center space-x-4">
                {/* Left Arrow */}
                <Arrowleft />

                {/* Joystick in the center */}
                <Joystick className="bg-gray-400 w-24 h-24 flex items-center justify-center" />

                {/* Right Arrow */}
                <Arrowright />
              </div>

              {/* Bottom Arrow */}
              <Arrowdown />
            </div>
          </div>

          <div className='grid grid-rows-2 grid-cols-2 gap-4'>
            {buttons.map((button) => (
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


        <div className="flex justify-center items-center w-screen h-[50vh] bg-slate-100 space-x-1">
          {keyChunks.map((chunk, index) => (
            <div key={index} className="flex flex-col">
              {chunk.map((key) => (
                <Key label={key}>
                </Key>
              ))}
            </div>
          ))}
        </div>
      </MessageContext.Provider >
    </>
  )
}

export default App

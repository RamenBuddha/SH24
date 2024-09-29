import Navbar from './components/Navbar'
import Button from './components/Button'
import Joystick from './components/Joystick'
import Key from './components/Key'
import MessageContext from './components/MessageContext'
import { useState } from 'react'
import Arrowdown from './components/Arrowdown'
import Arrowleft from './components/Arrowleft'
import Arrowright from './components/Arrowright'
import Arrowtop from './components/Arrowtop'

function App() {
  let keys = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "{", "}", "\\", "|", ";", ":", "'", "\"", ",", ".", "/", "<", ">", "?"];

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

  const [buttons, setButtons] = useState([

    { id: "redButton", bind: "N/A" },
    { id: "greenButton", bind: "N/A" },
    { id: "yellowButton", bind: "N/A" },
    { id: "blueButton", bind: "N/A" },
    { id: "whiteButton", bind: "N/A" },
  ])

  const createData = () => {
    const data = buttons.reduce((acc, button) => {
      acc[button.id] = button.bind;
      return acc;
    }, {});
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
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === id ? { ...button, bind: newBind.charCodeAt(0) } : button
      )
    );
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
                bind={button.bind}
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

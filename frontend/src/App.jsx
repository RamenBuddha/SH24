import Navbar from './components/Navbar'
import Button from './components/Button'
import Joystick from './components/Joystick'
import Key from './components/Key'
import MessageContext from './components/MessageContext'
import { useState } from 'react'

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
    { id: 1, bind: "N/A" },
    { id: 2, bind: "N/A" },
    { id: 3, bind: "N/A" }
  ])

  const createButtonsJson = () => {
    const jsonData = JSON.stringify(buttons, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);


    const a = document.createElement("a");
    a.href = url;
    a.download = "buttons_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateButtonBind = (id, newBind) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === id ? { ...button, bind: newBind } : button
      )
    );
  };

  return (
    <>
      <MessageContext.Provider value={{ createButtonsJson, message, setMessage }}>
        <Navbar></Navbar>
        <div id="topDiv" className=" w-screen h-[50vh] bg-white flex justify-evenly items-center">
          <Joystick></Joystick>
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
      </MessageContext.Provider>
    </>
  )
}

export default App

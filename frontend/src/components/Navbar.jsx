import MessageContext from "./MessageContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const { createButtonsJson } = useContext(MessageContext);

    const { sendToDevice } = useContext(MessageContext);
    const { createData } = useContext(MessageContext);

    const handleClick = () => {
        createButtonsJson();
    }

     const handleClick2 = () =>{
        const data = createData();
        sendToDevice(data);
    }

    return (
        <>
            <header className="bg-black px-16 py-2 z-10 w-full fixed flex items-center justify-between left-0 top-0 box-border">
                <div className="flex items-center">
                    <span className="hover:cursor-pointer hover:transition duration-350 ease-in-out hover:text-slate-400 font-bold text-white text-left">🎮 OpenController</span>
                </div>
                <div className="flex item-center">
                    <button onClick={handleClick2} className="transition-transform hover:scale-105 rounded-sm px-6 py-2 bg-white hover:cursor-pointer hover:transition duration-350 ease-in-out font-bold text-black">Write to Controller</button>
                    <button onClick={handleClick} className="ml-4 transition-transform hover:scale-105 rounded-sm px-6 py-2 bg-white hover:cursor-pointer hover:transition duration-350 ease-in-out font-bold text-black">Export</button>
                </div>
            </header>
        </>
    )
}


export default Navbar
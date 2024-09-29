import MessageContext from "./MessageContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const {createButtonsJson} = useContext(MessageContext);

    const handleClick = () => {
        createButtonsJson();
    }
    return (
        <>
        <header class="bg-black px-16 py-2 z-10 w-full fixed flex items-center justify-between left-0 top-0 box-border">
        <div className="flex items-center">
        <span className="hover:cursor-pointer hover:transition duration-350 ease-in-out hover:text-slate-400 font-bold text-white text-left">🎮 OpenController</span>
        </div>
        <button onClick ={handleClick} className="transition-transform hover:scale-105 rounded-sm px-6 py-2 bg-white hover:cursor-pointer hover:transition duration-350 ease-in-out font-bold text-black">Export</button>
        </header>        
        </>
    )
}


export default Navbar
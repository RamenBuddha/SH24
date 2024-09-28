import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <>
        <header class="bg-pink-300 px-16 py-2 z-10 w-full fixed flex items-center justify-between left-0 top-0 box-border">
        <span className="hover:cursor-pointer hover:transition duration-350 ease-in-out hover:text-black font-bold text-white text-left">SH24</span>
        <span className="transition-transform hover:scale-105 rounded-sm px-6 py-2 bg-pink-200 hover:cursor-pointer hover:transition duration-350 ease-in-out hover:text-slate-100 font-bold text-white text-left">Export</span>
        </header>        
        </>
    )
}


export default Navbar
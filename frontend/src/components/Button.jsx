import MessageContext from "./MessageContext";
import { useState, useEffect, useContext } from "react"


const Button = ({ id, bind, isListening, setListeningButton, updateButtonBind }) => {
    const { message, setMessage } = useContext(MessageContext);

    const [isBlinking, setIsBlinking] = useState(false);

    const handleClick = () => {
        setMessage('');
        setListeningButton(id);
        setIsBlinking(true);
    }

    useEffect(() => {
        if (isListening && message) {
            updateButtonBind(id, message);
            setListeningButton(null);
            setMessage('');
            setIsBlinking(false);
        }
    }, [message, isListening, id, updateButtonBind, setListeningButton, setMessage])

    const getColor = () => {
        let color = id.slice(0,id.indexOf("Button"))
        switch (color){
            case "red":
                return "bg-red-200"
            case "blue":
                return "bg-blue-200"
            case "green":
                return "bg-green-200"
            case "yellow":
                return "bg-yellow-200"
            case "white":
                return "bg-slate-200"
        }
        
    }

    return (
        <>
            <button onClick={handleClick} className={`${getColor()} block rounded-full border-2 p-2 w-16 h-16 border-black flex items-center justify-center 
                ${isListening ? "animate-blink" : ""} hover:bg-gray-300 hover:border-red-500 transition-colors duration-900 hover:transform hover:scale-90 transition-transform duration-2000 ease-in-out`}>
                {bind}
            </button>
        </>
    )
}
export default Button
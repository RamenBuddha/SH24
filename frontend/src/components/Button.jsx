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
    return (
        <>
            <button onClick={handleClick} className={`rounded-full border-2 p-2 w-16 h-16 border-black flex items-center justify-center 
                ${isListening ? "animate-blink" : ""} hover:bg-gray-300 hover:border-red-500 transition-colors duration-900 hover:transform hover:scale-90 transition-transform duration-2000 ease-in-out`}>
                {bind}
            </button>
        </>
    )
}
export default Button
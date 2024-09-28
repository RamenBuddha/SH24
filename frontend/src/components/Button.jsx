import MessageContext from "./MessageContext";
import { useState, useEffect, useContext} from "react"

const Button = ({id, isListening, setListeningButton}) => {
    const {message,setMessage} = useContext(MessageContext);

    const[bind,setBind] = useState("N/A");

    const handleClick = () => {
        setMessage('');
        setListeningButton(id);
    }

    useEffect(() => {
        if (isListening && message) {
            setBind(message);
            setListeningButton(null);
            setMessage('');
        }
    }, [isListening, setListeningButton, setMessage, message])

    return (
        <>
        <button onClick={handleClick} className="rounded-full border-2 p-2 w-16 h-16 border-black flex items-center justify-center">
        {bind}
        </button>        
        </>
    )
}
export default Button
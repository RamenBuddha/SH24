
import { useState, useEffect} from "react"

const Button = (key) => {
    const[bind,setBind] = useState("");
    const [isListening, setIsListening] = useState(false);

    const handleClick = () => {
        setIsListening(true);
    }

    const handleKeyPress = (event) => {
        if (isListening) {
            if (event.key === " "){
                setBind("Space".toUpperCase());
            } else{
                setBind(event.key.toUpperCase());
            }
        }
        setIsListening(false);
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
          };
    }, [isListening])

    return (
        <>
        <button onClick={handleClick} className="rounded-full border-2 p-2 w-16 h-16 border-black flex items-center justify-center">
        {bind}
        </button>        
        </>
    )
}
export default Button
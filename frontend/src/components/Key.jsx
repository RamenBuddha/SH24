import MessageContext from "./MessageContext";
import { useContext } from "react";

const Key = ({label}) =>{
    const { setMessage } = useContext(MessageContext);
    return (
        <>
        <button onClick={() => {setMessage(label)}} className="m-1 p-2 rounded border border-gray-400 hover:scale-90 duration-300">{label}</button>
        </>
    )
}

export default Key
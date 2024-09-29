const Joystick = ({ styleProps }) => {
    console.log(styleProps)
    return (
        <div className="relative w-32 h-32 bg-black rounded-full flex items-center justify-center">
            <div
                id="redCircle"
                className="w-16 h-16 bg-red-500 rounded-full absolute transition-transform duration-300"
                style={styleProps}
            ></div>
        </div>
    );
};

export default Joystick;

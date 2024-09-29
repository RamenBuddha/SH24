import { useState, useEffect } from 'react';

const Joystick = () => {
    return (
        <div className="relative w-32 h-32 bg-black rounded-full flex items-center justify-center">
            <div
                className="w-16 h-16 bg-red-500 rounded-full relative transition-transform duration-300"
            ></div>
        </div>
    );
};

export default Joystick;

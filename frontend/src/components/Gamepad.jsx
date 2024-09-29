import React from 'react';

const GamepadMode = ({ bind, toggleGamepadMode }) => {
  const getColor = () => {
    return bind === true ? "bg-green-500" : "bg-red-500";  // Green for On, Red for Off
  };

  return (
    <>
    <p className="font-thin">Gamepad Mode:</p>
    <button
      onClick={toggleGamepadMode}
      className={`${getColor()} hover:scale-90 transform transition-transform mt-6 block rounded-lg border-2 p-4 w-16 h-16 border-black flex items-center justify-center 
        hover:bg-gray-400 hover:border-red-500 transition-colors duration-150`}>
      {bind === false ? "Off" : "On"}
    </button>
    </>
  );
};

export default GamepadMode;
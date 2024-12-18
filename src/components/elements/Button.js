import React from "react";

const Button = ({ innerText, className,  onClick}) => {
  return (
    <button
      type="submit"
      className={`font-medium w-full text-white py-2 rounded-lg transition duration-300 ${className}`}
      onClick={onClick}
    >
      {innerText}
    </button>
  );
};

export default Button;

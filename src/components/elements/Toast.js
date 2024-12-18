// GlassToast.js
import React, { useContext } from "react";
import { UserRoleContext } from "../../context/Context";

const Toast = ({ onClose }) => {
  const { Message } = useContext(UserRoleContext);

  return (
    <div className="fixed top-4 right-4 w-80 p-4 rounded-lg shadow-lg backdrop-blur-sm bg-white/30 border border-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-gray-900">{Message}</span>
        <button onClick={onClose} className="text-gray-900 hover:text-gray-700">
          &times;
        </button>
      </div>
    </div>
  );
};



export default Toast;

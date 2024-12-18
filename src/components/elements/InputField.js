import React from "react";

const InputField = ({
  type,
  id,
  name,
  value,
  onChange,
  className,
  placeholder,
  defaultValue
}) => {
  return (
    <input
      className={`w-full p-2 border border-gray-300 rounded-lg ${className}`}
      placeholder={placeholder}
      type={type}
      id={id}
      name={name}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
    />
  );
};

export default InputField;

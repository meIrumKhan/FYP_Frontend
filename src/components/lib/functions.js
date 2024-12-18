import { MAXPASSLENGTH, MINPASSLENGTH } from "./const";
import { toast } from "react-hot-toast";

function validatePassword(password) {
  const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
  const upperCaseRegex = /[A-Z]/;
  const lowerCaseRegex = /[a-z]/;
  if (password.length < MINPASSLENGTH) {
    return {
      isValid: false,
      message: `Password must be at least ${MINPASSLENGTH} characters long.`,
    };
  }
  if (password.length > MAXPASSLENGTH) {
    return {
      isValid: false,
      message: `Password must not exceed ${MAXPASSLENGTH} characters.`,
    };
  }

  if (!upperCaseRegex.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter.",
    };
  }

  if (!lowerCaseRegex.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter.",
    };
  }

  if (!specialCharacterRegex.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character.",
    };
  }

  return { isValid: true, message: "Password is valid." };
}

// array and the id
const deleteById = (array, idToDelete) => {
  return array.filter((arr) => arr._id !== idToDelete);
};

const updateObjectInArray = (array, newObject, id) => {
  return array.map((item) => {
    if (item._id === id) {
      return { ...item, ...newObject };
    }
    return item;
  });
};

const extractIds = (arr) => {
  return arr.map((item) => item._id);
};

// Toast

const toastDisplay = (message, type) => {
  const baseStyle = {
    duration: 5000,
    position: "bottom-right",
    style: {
      borderRadius: "8px",
      background: "#444",
      color: "#fff",
      fontSize: "0.9rem",
    },
  };

  type === "error"
    ? toast.error(message, baseStyle)
    : toast.success(message, baseStyle);
};

export {
  validatePassword,
  deleteById,
  updateObjectInArray,
  extractIds,
  toastDisplay,
};

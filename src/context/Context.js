import { createContext, useState } from "react";

const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  
  const [userProfile, setUserProfile] = useState({
    name : "",
    isAdmin : '',
    email : "",
    phno  : 0
  })
 

  const login = () => {
    setisLoggedIn(true);
  };

  const logout = () => {
    setisLoggedIn(false);
  };

  const contextValue = {
    isLoggedIn,
    login,
    logout,
    userProfile, 
    setUserProfile,
  };

  return (
    <UserRoleContext.Provider value={contextValue}>
      {children}
    </UserRoleContext.Provider>
  );
};


export { UserRoleContext };
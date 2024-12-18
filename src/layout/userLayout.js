import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { UserRoleContext } from "../context/Context";
import Navbar from "../components/shared/Navbar";

const UserLayout = () => {
    const { isLoggedIn, userProfile } = useContext(UserRoleContext);

  const isAuthenticated = isLoggedIn();
  const isAdmin = isAuthenticated && userProfile?.isAdmin;

  if (!isAuthenticated || isAdmin) return <Navigate to="/signin" />;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;

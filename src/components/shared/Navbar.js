import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserRoleContext } from "../../context/Context";
import { AuthFetchdata } from "../lib/handleFetch/FetchData";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, userProfile } = useContext(UserRoleContext);

  const handleLogout = async () => {
    const resp = await AuthFetchdata("GET", "/logout");
    if (resp.logout && resp.logout === true) {
      logout();
      navigate("/signin");
    }
  };

  const tabs = [
    { name: "Bookings", path: "/user/bookings" },
    // { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-700 bg-opacity-50 text-white p-4 flex justify-between items-center">
      {/* Brand/Logo */}
      <div
        className="text-lg font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        AirTik
      </div>

      <div className="hidden md:flex space-x-6">
        <Link
          to="/flights"
          className="text-sm font-medium hover:text-gray-300 transition"
        >
          Flights
        </Link>
        {isLoggedIn && !userProfile.isAdmin &&
          tabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.path}
              className="text-sm font-medium hover:text-gray-300 transition"
            >
              {tab.name}
            </Link>
          ))}
      </div>

      {/* Authentication Buttons */}
      <div>
        {isLoggedIn ? (
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

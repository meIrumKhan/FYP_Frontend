import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { UserRoleContext } from "../context/Context";
import AdminMenu from "../components/menus/adminMenu";
import Navbar from "../components/shared/Navbar";


const AdminLayout = () => {
  const { isLoggedIn, userProfile } = useContext(UserRoleContext);

  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const adminOptions = [
    {
      id: 1,
      title: "Location",
      option: [
        {
          id: 1,
          title: "Add Location",
          link: "/admin/location/add",
        },
        {
          id: 2,
          title: "Locations",
          link: "/admin/location",
        },
      ],
    },
    {
      id: 2,
      title: "Users",
      option: [
        {
          id: 1,
          title: "Users",
          link: "/admin/user",
        },
        {
          id: 2,
          title: "Add User",
          link: "/admin/user/add",
        },
      ],
    },
    {
      id: 3,
      title: "Routes",
      option: [
        {
          id: 1,
          title: "Routes",
          link: "/admin/routes",
        },
        {
          id: 2,
          title: "Add Route",
          link: "/admin/routes/add",
        },
      ],
    },
    {
      id: 4,
      title: "Airlines",
      option: [
        {
          id: 1,
          title: "Airlines",
          link: "/admin/airlines",
        },
        {
          id: 2,
          title: "Add Airline",
          link: "/admin/airlines/add",
        },
      ],
    },
    {
      id: 5,
      title: "Flights",
      option: [
        {
          id: 1,
          title: "Flights",
          link: "/admin/flights",
        },
        {
          id: 2,
          title: "Add Flight",
          link: "/admin/flights/add",
        },
      ],
    },
    {
      id: 6,
      title: "Booking",
      link: "/admin/bookings",
    }
  ];
  

  const toggleSubItems = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Navbar />

      {/* min-h-screen */}
      <div className="flex min-h-screen">
        {isLoggedIn && userProfile?.isAdmin && (
          <AdminMenu
            options={adminOptions}
            isSidebarOpen={isSidebarOpen}
            activeMenu={activeMenu}
            toggleSubItems={toggleSubItems}
          />
        )}

        <div className="flex-1 p-6 bg-gray-100">
          {isLoggedIn && userProfile?.isAdmin && (
            <button
              onClick={toggleSidebar}
              className="sm:hidden p-2 bg-blue-500 text-white rounded-md mb-4"
            >
              {isSidebarOpen ? "Close Menu" : "Open Menu"}
            </button>
          )}

          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;

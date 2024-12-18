import React from 'react'
import { Link } from 'react-router-dom'

const AdminMenu = ({options, isSidebarOpen, activeMenu, toggleSubItems}) => {
  return (
    <div
    className={`${
      isSidebarOpen ? "block" : "hidden"
    } sm:block w-64 h-screen bg-gray-800 text-white p-5 fixed top-0 left-0 z-50 sm:relative sm:w-64 transition-all ease-in-out duration-300`}
  >
    <Link className="text-xl font-semibold mb-4" to={'/'} >Admin Panel</Link>

    {options.map((option) => (
      <div key={option.id}>
      
        {!option.option ? (
          <Link
            to={option.link}
            className="cursor-pointer font-semibold mb-2"
          >
            {option.title}
          </Link>
        ) : (
          <div>
            <div
              className="cursor-pointer font-semibold mb-2"
              onClick={() => toggleSubItems(option.id)}
            >
              {option.title}
            </div>

            {/* Render sub-options if they exist */}
            <ul
              className={`${
                activeMenu === option.id ? "block" : "hidden"
              } pl-6 space-y-2`}
            >
              {option.option.map((subOption) => (
                <li key={`${option.id}-${subOption.id}`}>
                  <Link
                    to={subOption.link}
                    className="text-blue-300 hover:text-blue-500"
                  >
                    {subOption.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ))}
  </div>
  )
}

export default AdminMenu

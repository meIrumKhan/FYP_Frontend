import React, { useCallback, useEffect, useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";
import { deleteById, toastDisplay } from "../../components/lib/functions";
import { Toaster } from "react-hot-toast";
import InputField from "../../components/elements/InputField";
import Button from "../../components/elements/Button";

const GETLocations = () => {
  const [data, setData] = useState([]);
  const loadProgress = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedField, setSelectedField] = useState({
    _id: "",
    city: "",
    country: "",
  });

  const usersPerPage = 6;

  const handleFetch = useCallback(async (method, url, body) => {
    if (loadProgress.current) {
      loadProgress.current.continuousStart();
    }
    try {
      const result = await Fetchdata(method, url, body);

      if (result.locations) {
        setData(result.locations);
      }
      if (result.login === false) {
        toastDisplay(result.message, "error");
      }
      return result;
    } catch (e) {
      console.log(e.message);
    } finally {
      if (loadProgress.current) {
        loadProgress.current.complete();
      }
    }
  }, []);

  useEffect(() => {
    handleFetch("GET", "/getalllocations");
  }, [handleFetch]);

  // Handle the selection of a location
  const handleSelectLocation = (location) => {
    setSelectedField({
      _id: location._id,
      city: location.city,
      country: location.country,
    });
  };

  const handleDelete = async (ID) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure for delete this location"
      );
      if (confirmDelete) {
        const resp = await handleFetch(
          "POST",
          "/deletelocation",
          { ID },
          false
        );
        if (resp.ID) {
          const filterLoc = deleteById(data, resp.ID);
          setData(filterLoc);
        }
      }
    } catch (e) {
      toastDisplay(e.message, "error");
    }
  };

  const handleUpdateLocation = async () => {
    const { _id } = selectedField;
    if (!_id) {
      toastDisplay("Please select a location to update.", "error");
      return;
    }

    try {
      const result = await handleFetch(
        "POST",
        `/updateLocation`,
        selectedField
      );
      if (result.success) {
        toastDisplay(result.message, "success");
        setSelectedField({
          _id: "",
          city: "",
          country: "",
        });
        handleFetch("GET", "/getalllocations");
      } else {
        toastDisplay(result.message, "error");
      }
    } catch (e) {
      toastDisplay("An error occurred while updating the location", "error");
    }
  };

  const filteredUsers = data.filter((loc) => {
    return loc.city.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastItem = currentPage * usersPerPage;
  const indexOfFirstItem = indexOfLastItem - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 rounded-lg">
  <LoadingBar ref={loadProgress} color="#f11946" />
  <Toaster position="top-right" reverseOrder={false} />
  <div className="w-full max-w-3xl p-8 rounded-lg">
    <div className="flex gap-4 mb-4">
      <InputField
        name="search"
        placeholder="Search City"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>

    {/* select for update */}
    <div className="p-2 rounded-md bg-gray-300 shadow-gray-400 shadow-md m-2">
      <h3 className="text-1xl font-medium text-gray-500">Selected Location</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700">City</label>
          <InputField
            name="city"
            placeholder="Enter city name"
            value={selectedField.city}
            onChange={(e) => setSelectedField({ ...selectedField, city: e.target.value })}
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700">Country</label>
          <InputField
            name="country"
            placeholder="Enter country name"
            value={selectedField.country}
            onChange={(e) => setSelectedField({ ...selectedField, country: e.target.value })}
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div>
          <Button
            innerText="Update"
            onClick={handleUpdateLocation}
            className="w-full mt-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          />
        </div>
      </div>
    </div>

    {/* Displaying locations */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {currentUsers.length > 0 ? (
    currentUsers.map((loc, index) => (
      <div
        key={index}
        className="bg-gradient-to-r from-gray-500 via-gray-300 bg-opacity-50 to-gray-200 transition-transform duration-300 rounded-lg shadow-lg flex flex-col items-center justify-center w-64 h-48 p-5 text-gray-800"
      >
        <h3 className="text-2xl font-semibold text-gray-800">{loc.city}</h3>
        <h4 className="text-md text-gray-500">{loc.country}</h4>

        <div className="flex space-x-4 mt-4">
          <button
            className="px-4 w-full py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800"
            onClick={() => handleSelectLocation(loc)}
          >
            Select
          </button>
          <button
            className="bg-red-600 text-white rounded-full px-5 py-2 font-medium hover:bg-red-500 hover:scale-105 transition-transform duration-300"
            onClick={() => handleDelete(loc._id)}
          >
            Delete
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="col-span-full text-center text-gray-500">No location found.</p>
  )}
</div>



    {/* Pagination */}
    <div className="flex justify-center m-4">
      <nav>
        <ul className="flex space-x-2">
          {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, index) => (
            <li key={index}>
              <button
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"} rounded`}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </div>
</div>

  );
};

export default GETLocations;

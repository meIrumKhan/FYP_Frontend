import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserRoleContext } from "../../context/Context";
import InputField from "../../components/elements/InputField";
import { deleteById, toastDisplay } from "../../components/lib/functions";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";


const GETAirlines = () => {
  const loadProgress = useRef(null);
  const { logout } = useContext(UserRoleContext);
  const [data, setData] = useState([])

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const handleFetch = useCallback(
    async (method, url, body, form) => {
      if (loadProgress.current) {
        loadProgress.current.continuousStart();
      }
      try {
        const result = await Fetchdata(method, url, body, form);
        if (result.login === false) {
          logout();
          navigate("/login");
        }

        if (result.airlines) {
          setData(result.airlines);
        }
 

        if (result.success) {
          toastDisplay(result.message, "success");
        } else {
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
    },
    [logout, navigate]
  );

  useEffect(() => {
    handleFetch("GET", "/getallairlines");
  }, []);

  const handleDelete = async (ID) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure for delete this airline"
      );
      if (confirmDelete) {
        const resp = await handleFetch(
          "POST",
          "/deleteairlines",
          { ID },
          false
        );
        if (resp.ID) {
          const filterAlirlines = deleteById(data, resp.ID);
          setData(filterAlirlines);
        }
      }
    } catch (e) {
      toastDisplay(e.message, "error");
    }
  };

    

  const filteredItems = data.filter((item) => {
    const matchesSearchTerm = item.airline
      // .toLowerCase()
      // .includes(searchTerm.toLowerCase());
    return matchesSearchTerm;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 rounded-lg">
      <LoadingBar ref={loadProgress} color="#f11946" />
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-3xl p-8 rounded-lg">
        <div className="flex gap-4 mb-4">
          <InputField
            name="search"
            placeholder="Search Airline"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {currentItems.length > 0 ? (
            currentItems.map((airline, index) => (
              <div key={index} className="rounded-tl-[50px] p-2 rounded-br-[25px] relative bg-gradient-to-r from-gray-800 via-gray-600 bg-opacity-50 to-gray-400 text-white shadow-lg w-56 m-4">
                <div className="relative group">
                  <img
                    className="rounded-tl-[50px] w-56 h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    src={
                      airline.image && airline.image.contentType && airline.image.data
                        ? `data:${airline.image.contentType};base64,${btoa(
                            String.fromCharCode(
                              ...new Uint8Array(airline.image.data.data)
                            )
                          )}`
                        : "default-image-url.jpg"
                    }
                    alt={airline.name}
                  />

                  <div className="absolute top-2 right-2">
                    <button className="bg-blue-500 text-white text-xs font-semibold py-1 px-3 rounded-full shadow-md">
                      New
                    </button>
                  </div>
                </div>

                <div className="mt-2 p-2">
                  <h2 className="text-lg font-bold font-medium text-white">
                    {airline.code}
                  </h2>
                  <p className="text-base font-medium text-[14px] text-gray-300">
                    {airline.airline}
                  </p>
                  
                </div>

                <div className="mt-1 flex gap-2 justify-center">
                  <button
                    className="bg-blue-500 text-white rounded-full px-5 py-1 font-semibold hover:shadow-sm hover:shadow-blue-500 hover:text-blue-500 hover:bg-white hover:scale-105 transition-transform duration-300"
                    onClick={() =>
                      navigate("/admin/airlines/update", {
                        state: airline,
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white rounded-full px-5 py-1 font-semibold hover:shadow-sm hover:shadow-red-500 hover:text-red-500 hover:bg-white hover:scale-105 transition-transform duration-300"
                    onClick={() => handleDelete(airline._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No items available.
            </p>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <nav>
            <ul className="flex space-x-2">
              {Array.from({
                length: Math.ceil(filteredItems.length / itemsPerPage),
              }).map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    } rounded`}
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

export default GETAirlines;

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import LoadingBar from "react-top-loading-bar";
import { deleteById, toastDisplay } from "../../components/lib/functions";
import InputField from "../../components/elements/InputField";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";
import { useNavigate } from "react-router-dom";

const GETRoutes = () => {
  const loadProgress = useRef(null);
  const [routesList, setRoutesList] = useState([]);
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const routesPerPage = 6;

  const handleFetch = useCallback(
    async (method, url, body) => {
      if (loadProgress.current) {
        loadProgress.current.continuousStart();
      }
      try {
        const result = await Fetchdata(method, url, body);

        if (result.routes) {
          setRoutesList(result.routes);
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
    },
    [setRoutesList]
  );

  const filteredRoutes = routesList.filter((route) => {
    const matchesSearchTerm = route.origin.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesSearchTerm;
  });

  const handleDelete = async (ID) => {
    const confirmDelete = window.confirm(
      "Are you sure for delete this user"
    );
    if(confirmDelete){
      const resp = await handleFetch("POST", "/deleteflightroute", { ID }, false);
      if(resp.ID){
        const filterRoutes = deleteById(routesList, resp.ID);
        setRoutesList(filterRoutes);
      }
    }
  
  };

  useEffect(() => {
    handleFetch("GET", "/getallroutes");
  }, []);

  const indexOfLastItem = currentPage * routesPerPage;
  const indexOfFirstItem = indexOfLastItem - routesPerPage;
  const currentRoute = filteredRoutes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 rounded-lg">
      <LoadingBar ref={loadProgress} color="#f11946" />
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="w-full max-w-3xl p-8 rounded-lg">
        <div className="flex gap-4 mb-4">
          <InputField
            name="search"
            placeholder="Search route origin"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentRoute.length > 0 ? (
          currentRoute.map((route, index) => (
            <div className="bg-gradient-to-r from-gray-500 via-gray-300 bg-opacity-50 to-gray-200 transition-transform duration-300  rounded-lg shadow-lg flex flex-col items-center justify-center w-72 h-72 p-5 text-gray-800">
            
              <h3 className="text-xl font-semibold text-gray-800">
                {`${route.origin} - ${route.destination}`} 
              </h3>
              <h4 className="text-md text-gray-500">Duration : {route.duration}</h4>
              <div className="mt-2 py-1 px-3 font-medium bg-gray-100 text-gray-700 rounded-full text-sm shadow-sm">
                {route.distance + ' km/h'}
              </div>

              <div className="flex space-x-4 mt-4">
                <button
                  className="bg-red-600 text-white rounded-full px-5 py-2 font-medium hover:bg-red-500  hover:scale-105 transition-transform duration-300"
                  onClick={() => handleDelete(route._id)}
                >
                  Delete
                </button>
                <button className="bg-blue-600 text-white rounded-full px-5 py-2 font-medium hover:bg-blue-500 hover:scale-105  hover:scale-80 transition-transform duration-300"
                onClick={() =>
                      navigate("/admin/routes/update", {
                        state: route,
                      })
                    }
                >
                  Update
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No users found.
          </p>
        )}
      </div>

      <div className="flex justify-center m-4">
        <nav>
          <ul className="flex space-x-2">
            {Array.from({
              length: Math.ceil(filteredRoutes.length / routesPerPage),
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
  );
};

export default GETRoutes;

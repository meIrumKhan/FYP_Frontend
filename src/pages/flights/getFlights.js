import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import LoadingBar from "react-top-loading-bar";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserRoleContext } from "../../context/Context";
import InputField from "../../components/elements/InputField";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";
import { deleteById, toastDisplay } from "../../components/lib/functions";

const GETFlights = () => {
  const loadProgress = useRef(null);
  const { logout } = useContext(UserRoleContext);
  const [data, setData] = useState([]);
  const [airlineFilter, setAirlineFilter] = useState("");
  const [originFilter, setOriginFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");

  const navigate = useNavigate();

  const handleFetch = useCallback(
    async (method, url, body, form) => {
      if (loadProgress.current) loadProgress.current.continuousStart();

      try {
        const result = await Fetchdata(method, url, body, form);
        if (result.login === false) {
          logout();
          navigate("/login");
        }

        if (result.message) {
          toastDisplay(result.message, result.success);
        }

        if (result.flights) {
          setData(result.flights);
        }



        return result;
      } catch (e) {
        console.error(e.message);
      } finally {
        if (loadProgress.current) loadProgress.current.complete();
      }
    },
    [logout, navigate]
  );

  useEffect(() => {
    handleFetch("GET", "/getallflights");
  }, []);

  const handleDelete = async (ID) => {
    const confirmDelete = window.confirm("Are you sure for delete this flight");
    if (confirmDelete) {
      const resp = await handleFetch("POST", "/deleteflight", { ID }, false);
      if (resp.ID) {
        const filterFlights = deleteById(data, resp.ID);
        setData(filterFlights);
      }
    }
  };

  const filteredItems = data.filter((item) => {
    const matchesAirline =
      airlineFilter === "" ||
      item.airline?.airline.toLowerCase().includes(airlineFilter.toLowerCase());
    const matchesOrigin =
      originFilter === "" ||
      item.route?.origin.toLowerCase().includes(originFilter.toLowerCase());
    const matchesDestination =
      destinationFilter === "" ||
      item.route?.destination
        .toLowerCase()
        .includes(destinationFilter.toLowerCase());

    return matchesAirline && matchesOrigin && matchesDestination;
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 rounded-lg">
      <LoadingBar ref={loadProgress} color="#f11946" />
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-7xl p-8 rounded-lg">
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <InputField
            name="airlineFilter"
            placeholder="Filter by Airline"
            value={airlineFilter}
            onChange={(e) => setAirlineFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <InputField
            name="originFilter"
            placeholder="Filter by Origin"
            value={originFilter}
            onChange={(e) => setOriginFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <InputField
            name="destinationFilter"
            placeholder="Filter by Destination"
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex flex-col gap-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((flight, index) => (
              <div
                key={index}
                className="flex items-center bg-gradient-to-r from-blue-50 to-gray-100 shadow-lg rounded-xl p-6 w-full hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 border border-gray-300 shadow-sm">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      flight.airline?.image &&
                      flight.airline?.image.contentType &&
                      flight.airline?.image.data
                        ? `data:${
                            flight.airline?.image.contentType
                          };base64,${btoa(
                            String.fromCharCode(
                              ...new Uint8Array(flight.airline?.image.data.data)
                            )
                          )}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={flight.airline?.airline}
                  />
                </div>

                <div className="flex-1 px-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {flight.flightNumber} - {flight.airline?.code}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Airline:{" "}
                    <strong className="text-gray-800">
                      {flight.airline?.airline}
                    </strong>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Route:{" "}
                    <strong className="text-gray-800">
                      {flight.route?.origin} ➝ {flight.route?.destination}
                    </strong>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Departure:{" "}
                    <strong className="text-gray-800">
                      {new Date(flight.departureTime).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </strong>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Price:{" "}
                    <strong className="text-gray-800">
                      PKR {flight.price}
                    </strong>
                  </p>

                  <div className="flex gap-2 p-2">
                    <button
                      className="bg-red-600 text-white rounded-full px-3 py-1 font-medium hover:bg-red-500  hover:scale-105 transition-transform duration-300"
                      onClick={() => handleDelete(flight._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-600 text-white rounded-full px-3 py-1 font-medium hover:bg-blue-500  hover:scale-105 transition-transform duration-300"
                      onClick={() =>
                      navigate("/admin/flights/update", {
                        state: flight,
                      })
                    }
                    >
                      Update
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full shadow-md hover:bg-blue-600 transition-colors duration-300">
                    Book Now
                  </button>
                  <p className="mt-2 text-xs text-gray-500">
                    Seats Available: <strong>{flight.available}</strong>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No flights available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GETFlights;

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import LoadingBar from "react-top-loading-bar";
import { Toaster } from "react-hot-toast";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import { UserRoleContext } from "../../context/Context";
import { gsap } from "gsap"; // Import GSAP

const UserFlights = () => {
  const { isLoggedIn } = useContext(UserRoleContext);

  const loadProgress = useRef(null);
  const [data, setData] = useState([]);
  const [originFilter, setOriginFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const navigate = useNavigate();

  const location = useLocation();

  // Set filters from the location state if available
  useEffect(() => {
    if (location.state) {
      const { origin, destination, date } = location.state;
      setOriginFilter(origin || "");
      setDestinationFilter(destination || "");
      setDateFilter(date || "");
    }
  }, [location.state]);

  // Fetch flights data from the backend API
  const handleFetch = useCallback(async (method, url, body, form) => {
    if (loadProgress.current) loadProgress.current.continuousStart();

    try {
      const result = await Fetchdata(method, url, body, form);

      if (result.flights) {
        setData(result.flights);
      }

      return result;
    } catch (e) {
      console.error(e.message);
    } finally {
      if (loadProgress.current) loadProgress.current.complete();
    }
  }, []);

  useEffect(() => {
    handleFetch("GET", "/getallflights");
  }, [handleFetch]);

  const filteredItems = data.filter((item) => {
    const matchesOrigin =
      originFilter === "" ||
      item.route?.origin?.city.toLowerCase().includes(originFilter.toLowerCase());
    const matchesDestination =
      destinationFilter === "" ||
      item.route?.destination?.city.toLowerCase().includes(destinationFilter.toLowerCase());
    const matchesDate =
      dateFilter === "" ||
      new Date(item.departureTime).toISOString().split("T")[0] === dateFilter;

    return matchesOrigin && matchesDestination && matchesDate;
  });

  const handleFlightBook = (flight) => {
    if (!isLoggedIn) {
      navigate("/signin");
    } else {
      navigate("/user/book", {
        state: flight,
      });
    }
  };

  const clearFilters = () => {
    setOriginFilter("");
    setDestinationFilter("");
    setDateFilter("");
  };

  
  useEffect(() => {
  
    gsap.fromTo(
      ".filter-input",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.3, ease: "power3.out" }
    );

    gsap.fromTo(
      ".flight-card",
      { opacity: 0, scale: 0.9, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 1.5, stagger: 0.3, ease: "power4.out" }
    );

   
    gsap.fromTo(
      ".flight-info-detail",
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, stagger: 0.2, ease: "power2.out" }
    );

    
    gsap.fromTo(
      ".book-now-button",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }
    );
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <LoadingBar ref={loadProgress} color="#f11946" />
        <Toaster position="top-right" reverseOrder={false} />

        <div className="w-full max-w-7xl p-6 rounded-lg">
          <div className="flex justify-center flex-wrap items-center gap-4 mb-4">
            <input
              className="filter-input w-64 p-3 bg-gray-800 text-white rounded-md shadow-md"
              name="originFilter"
              type="text"
              placeholder="Origin"
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value)}
            />
            <input
              className="filter-input w-64 p-3 bg-gray-800 text-white rounded-md"
              name="destinationFilter"
              type="text"
              placeholder="Destination"
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
            />
            <input
              className="filter-input w-64 p-3 bg-gray-800 text-white rounded-md shadow-md"
              name="dateFilter"
              type="date"
              placeholder="Date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <button
              onClick={clearFilters}
              className="px-5 py-3 bg-red-600 text-white shadow-sm shadow-red-600 rounded-md hover:bg-red-500 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Flights */}
          <div className="flex flex-col gap-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((flight, index) => (
                <div
                  key={index}
                  className="flight-card flex items-center bg-gray-800 shadow-lg rounded-xl p-6 w-full hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-full bg-gray-700">
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
                                ...new Uint8Array(
                                  flight.airline?.image.data.data
                                )
                              )
                            )}` 
                          : "https://via.placeholder.com/150"
                      }
                      alt={flight.airline?.airline}
                    />
                  </div>

                  <div className="flex-1 px-6">
                    <h2 className="text-xl font-semibold flight-info-detail">
                      {flight.flightNumber} - {flight.airline?.code}
                    </h2>
                    <h2 className="text-sm font-semibold flight-info-detail">
                      {flight.airline?.airline}
                    </h2>
                    <p className="text-sm mt-1 flight-info-detail">
                      Route: {flight.route?.origin?.city} ➝{" "}
                      {flight.route?.destination?.city}
                    </p>
                    <p className="text-sm mt-1 flight-info-detail">
                      Departure:{" "}
                      {new Date(flight.departureTime).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <p className="text-sm mt-1 flight-info-detail">
                      Price: PKR {flight.price}
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <button
                      className="book-now-button px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-300"
                      onClick={() => handleFlightBook(flight)}
                    >
                      Book Now
                    </button>
                    <p className="mt-2 text-xs text-gray-400">
                      Seats Available: {flight.available}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No flights available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserFlights;

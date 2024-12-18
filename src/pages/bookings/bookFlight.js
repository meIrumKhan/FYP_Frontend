import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserRoleContext } from "../../context/Context";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";
import { toastDisplay } from "../../components/lib/functions";
import { Toaster } from "react-hot-toast";
import LoadingBar from "react-top-loading-bar";

const BookFlight = () => {
    const loadProgress = useRef(null);
  const { logout } = useContext(UserRoleContext);
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state; 
  const [seats, setSeats] = useState(1);

  const handleFetch = useCallback(
    async (method, url, body, form) => {
      loadProgress.current?.continuousStart();
      try {
        const result = await Fetchdata(method, url, body, form);

        if (result.login === false) {
          logout();
          navigate("/login");
        }

        

        if (result.message) {
          toastDisplay(result.message, result.sucesss);
        } 

        return result;
      } catch (e) {
        console.error(e.message);
      } finally {
        loadProgress.current?.complete();
      }
    },
    [logout, navigate]
  );

  const handleCheckout = async() => {
    // console.log({
    //   seats,
    //   flight: location.state._id
    // })

    await handleFetch("POST", "/addbooking", {seats, flights: location.state._id}, false);


  };


  useEffect(() => {
    if(!location.state){
      navigate('/flights')
    }
  },[navigate, location.state])


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
     
     <LoadingBar ref={loadProgress} color="#4A90E2" />
     <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <h2 className="text-xl font-bold">{flight.flightNumber}</h2>
          <p className="text-gray-400">
            Route: {flight.route?.origin} ➝ {flight.route?.destination}
          </p>
          <p className="text-gray-400">
            Departure: {new Date(flight.departureTime).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <p className="text-gray-400">Price per Seat: PKR {flight.price}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Number of Seats</label>
          <input
            type="number"
            min="1"
            max={flight.available}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        <div className="mb-4">
          <p className="text-lg font-semibold">
            Total Amount: <span className="text-gray-300">PKR {seats * flight.price}</span>
          </p>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default BookFlight;

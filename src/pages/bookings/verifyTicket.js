import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";
import LoadingBar from "react-top-loading-bar";

const VerifyTicket = () => {
  const { ticketId } = useParams();
  const [ticketDetails, setTicketDetails] = useState(null);
  const loadProgress = useRef(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await Fetchdata("GET", `/ticket/${ticketId}`);
        setTicketDetails(response.booking);
        
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (!ticketDetails) {
    return (
      <div className="text-center text-blue-600">Loading ticket details...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <LoadingBar ref={loadProgress} color="#4A90E2" />
      <div className="w-2/3 bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg border border-gray-700">

        <h2 className="text-2xl font-extrabold mb-4 text-blue-400 flex items-center gap-2">
          Booking Details: {ticketDetails.ticketId}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="booking-detail">
            <p className="text-lg font-semibold text-gray-300">
              <span className="material-icons text-blue-400 align-middle mr-2">
                airplanemode_active
              </span>
              Flight Number:
              <span className="text-white font-bold ml-2">
                {ticketDetails.flights?.flightNumber || "N/A"}
              </span>
            </p>
          </div>
          <div className="booking-detail">
            <p className="text-lg font-semibold text-gray-300">
              <span className="material-icons text-blue-400 align-middle mr-2">
                location_on
              </span>
              Destination:
              <span className="text-white font-bold ml-2">
                {ticketDetails.flights.route?.destination?.city || "N/A"}
              </span>
            </p>
          </div>
          <div className="booking-detail">
            <p className="text-lg font-semibold text-gray-300">
              <span className="material-icons text-blue-400 align-middle mr-2">
                schedule
              </span>
              Departure Time:
              <span className="text-white font-bold ml-2">
                {new Date(
                  ticketDetails.flights?.departureTime
                ).toLocaleString() || "N/A"}
              </span>
            </p>
          </div>
          <div className="booking-detail">
            <p className="text-lg font-semibold text-gray-300">
              <span className="material-icons text-blue-400 align-middle mr-2">
                event_seat
              </span>
              Seats Booked:
              <span className="text-white font-bold ml-2">
                {ticketDetails.seats}
              </span>
            </p>
          </div>
          <div className="booking-detail">
            <p className="text-lg font-semibold text-gray-300">
              <span className="material-icons text-blue-400 align-middle mr-2">
                confirmation_number
              </span>
              Seat Numbers:
              <span className="text-white font-bold ml-2">
                {ticketDetails.seatNumbers.join(", ")}
              </span>
            </p>
          </div>
          <div className="booking-detail">
            <p className="text-lg font-semibold text-gray-300">
              Total Price:
              <span className="text-white font-bold ml-2">
                PKR {ticketDetails.totalPrice}
              </span>
            </p>
          </div>
          <div className="booking-detail">
            <p className="text-lg font-semibold text-gray-300">
              <span className="material-icons text-blue-400 align-middle mr-2">
                calendar_today
              </span>
              Booking Date:
              <span className="text-white font-bold ml-2">
                {new Date(ticketDetails.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>
          <div className="booking-detail">
            <p className="text-lg font-semibold text-gray-300">
              <span className="material-icons text-blue-400 align-middle mr-2">
                payment
              </span>
              Payment Status:
              <span
                className={`ml-2 font-bold ${
                  ticketDetails.paymentStatus === "Completed"
                    ? "text-green-500"
                    : ticketDetails.paymentStatus === "Pending"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {ticketDetails.paymentStatus}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyTicket;

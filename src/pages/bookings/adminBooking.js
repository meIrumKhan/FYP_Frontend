import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { UserRoleContext } from "../../context/Context";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";
import { toastDisplay } from "../../components/lib/functions";
import { Toaster } from "react-hot-toast";
import LoadingBar from "react-top-loading-bar";

const AdminBooking = () => {
  const loadProgress = useRef(null);
  const { logout } = useContext(UserRoleContext);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFetch = useCallback(
    async (method, url, body, form) => {
      loadProgress.current?.continuousStart();
      try {
        const result = await Fetchdata(method, url, body, form);

        if (result.login === false) {
          logout();
          navigate("/login");
        }

        if (result.bookings) {
          setData(result.bookings);
        }

        if (result.message) {
          toastDisplay(result.message, result.success);
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

  const handleDelete = async (ticketId) => {
   
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmDelete) return;

    const result = await handleFetch("POST", `/deletebooking`, {ticketId});
    if (result.success) {
      setData((prevData) => prevData.filter((booking) => booking.ticketId !== ticketId));
      setSelectedBooking(null);
    }
  };

  useEffect(() => {
    handleFetch("GET", "/getbookings");
  }, []);

  const filteredData = data.filter((booking) =>
    booking.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-200 text-gray-900 flex flex-col items-center py-10">
      <LoadingBar ref={loadProgress} color="#9CA3AF" />
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-6xl flex flex-col gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Booking ID"
          className="w-full p-3 rounded-lg border border-gray-300 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="w-full flex gap-8">
          {/* List of Bookings */}
          <div className="w-1/3 bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300 overflow-y-auto max-h-[600px]">
            <h2 className="text-xl font-semibold mb-4">Select a Booking</h2>
            <ul>
              {filteredData.map((booking) => (
                <li
                  key={booking._id}
                  className={`p-3 mb-3 rounded-lg cursor-pointer ${
                    selectedBooking?._id === booking._id
                      ? "bg-gray-300 text-gray-800"
                      : "bg-gray-50 text-gray-600"
                  } hover:bg-gray-200`}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <p>
                    <strong>Booking ID:</strong> {booking.ticketId || "N/A"}
                  </p>
                  <p>
                    <strong>Flight:</strong>{" "}
                    {booking.flights?.flightNumber || "N/A"}
                  </p>
                  <p>
                    <strong>User:</strong> {booking.user?.name || "N/A"} (
                    {booking.user?.email || "N/A"})
                  </p>
                 
                </li>
              ))}
            </ul>
          </div>

          {/* Booking Details */}
          <div className="w-2/3 bg-gray-50 p-6 rounded-lg shadow-md border border-gray-300">
            {selectedBooking ? (
              <div>
                <h2 className="text- font-bold mb-4">
                  Booking Details: {selectedBooking.ticketId}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-lg font-medium">
                      Flight Number:
                      <span className="text-gray-700 ml-2">
                        {selectedBooking.flights.flightNumber}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      Destination:
                      <span className="text-gray-700 ml-2">
                        {selectedBooking.flights.route?.destination || "N/A"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      Departure Time:
                      <span className="text-gray-700 ml-2">
                        {new Date(
                          selectedBooking.flights?.departureTime
                        ).toLocaleString() || "N/A"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      Seats Booked:
                      <span className="text-gray-700 ml-2">
                        {selectedBooking.seats}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      Seat Numbers:
                      <span className="text-gray-700 ml-2">
                        {selectedBooking.seatNumbers.join(", ")}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      Total Price:
                      <span className="text-gray-700 ml-2">
                        PKR {selectedBooking.totalPrice}
                      </span>
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-lg font-medium">
                      Booking Date:
                      <span className="text-gray-700 ml-2">
                        {new Date(
                          selectedBooking.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-lg font-medium">
                      User Details:
                      <span className="text-gray-700 ml-2">
                        {selectedBooking.user?.name || "N/A"} (
                        {selectedBooking.user?.email || "N/A"})
                      </span>
                    </p>
                  </div>
                  <button
                    className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent selecting the booking when clicking delete
                      handleDelete(selectedBooking.ticketId);
                    }}
                  >
                    Delete Booking
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-lg text-gray-500 text-center">
                Please select a booking to view details.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBooking;

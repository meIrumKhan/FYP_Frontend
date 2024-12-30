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
import { gsap } from "gsap";

const UserBooking = () => {
  const loadProgress = useRef(null);
  const { logout } = useContext(UserRoleContext);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

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
          toastDisplay(result.message, !result.success && "error");
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

  const handleCancelBooking = (id) => {
    const result = handleFetch("POST", `/cancelbooking/${id}`);
    if (result.success) {
      setSelectedBooking(null);
    }
  };

  useEffect(() => {
    handleFetch("GET", "/getuserbooking");

    // Animations
    gsap.fromTo(
      ".booking-list-item",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power3.out",
      }
    );

    if (selectedBooking) {
      gsap.fromTo(
        ".booking-detail",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power3.out",
        }
      );
    }

    gsap.fromTo(
      ".cancel-button",
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
  }, [selectedBooking]);

  useEffect(() => {
    handleFetch("GET", "/getuserbooking");
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <LoadingBar ref={loadProgress} color="#4A90E2" />
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-3xl font-bold mb-6">Your Bookings</h1>

      <div className="w-full max-w-6xl flex gap-8">
        {/* List of Bookings */}
        <div className="w-1/3 bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 h-56 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Select a Booking</h2>
          <ul>
            {data.map((booking) => (
              <li
                key={booking._id}
                className={`booking-list-item p-3 mb-3 rounded-lg cursor-pointer ${
                  selectedBooking?._id === booking._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300"
                } hover:bg-blue-400`}
                onClick={() => setSelectedBooking(booking)}
              >
                <p>
                  <strong>Booking ID:</strong> {booking.ticketId}
                </p>
                <p>
                  <strong>Flight:</strong>{" "}
                  {booking.flights?.flightNumber || "N/A"}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Booking Details */}
        <div className="w-2/3 bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg border border-gray-700">
          {selectedBooking ? (
            <div>
              <h2 className="text-2xl font-extrabold mb-4 text-blue-400 flex items-center gap-2">
                Booking Details: {selectedBooking.ticketId}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="booking-detail">
                  <p className="text-lg font-semibold text-gray-300">
                    <span className="material-icons text-blue-400 align-middle mr-2">
                      airplanemode_active
                    </span>
                    Flight Number:
                    <span className="text-white font-bold ml-2">
                      {selectedBooking.flights?.flightNumber || "N/A"}
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
                      {selectedBooking.flights.route?.destination?.city ||
                        "N/A"}
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
                        selectedBooking.flights?.departureTime
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
                      {selectedBooking.seats}
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
                      {selectedBooking.seatNumbers.join(", ")}
                    </span>
                  </p>
                </div>
                <div className="booking-detail">
                  <p className="text-lg font-semibold text-gray-300">
                    Total Price:
                    <span className="text-white font-bold ml-2">
                      PKR {selectedBooking.totalPrice}
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
                      {new Date(selectedBooking.createdAt).toLocaleDateString()}
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
                        selectedBooking.paymentStatus === "Completed"
                          ? "text-green-500"
                          : selectedBooking.paymentStatus === "Pending"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {selectedBooking.paymentStatus}
                    </span>
                  </p>
                </div>

                {/* Display QR Code */}
                <div className="booking-detail">
                  <p className="text-lg font-semibold text-gray-300">
                    <span className="material-icons text-blue-400 align-middle mr-2">
                      qr_code_scanner
                    </span>
                    QR Code:
                  </p>
                  {/* <img
                    src={selectedBooking.qrCode}
                    alt="QR Code"
                    className="w-32 h-32 mt-2"
                  /> */}
                  <img
                    className="w-32 h-32 object-cover rounded-md m-2"
                    src={
                      selectedBooking.qrCode && selectedBooking.qrCode.contentType && selectedBooking.qrCode.data
                        ? `data:${selectedBooking.qrCode.contentType};base64,${btoa(
                            String.fromCharCode(
                              ...new Uint8Array(selectedBooking.qrCode.data.data)
                            )
                          )}`
                        : "default-image-url.jpg"
                    }
                    alt={selectedBooking.qrCode}
                  />

                </div>
              </div>
              {selectedBooking.paymentStatus !== "Cancelled" && (
                <div className="mt-4 flex justify-end">
                  <button
                    className="cancel-button w-32 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition duration-200"
                    onClick={() => handleCancelBooking(selectedBooking._id)}
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-lg text-gray-400 text-center">
              <span className="material-icons text-blue-400 text-2xl align-middle">
                info
              </span>
              Please select a booking to view details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBooking;

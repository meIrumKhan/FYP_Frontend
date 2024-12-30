import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";
import LoadingBar from "react-top-loading-bar";
import jsPDF from "jspdf";

const VerifyTicket = () => {
  const { ticketId } = useParams();
  const [ticketDetails, setTicketDetails] = useState(null);
  const loadProgress = useRef(null);

  const handleViewPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(40, 116, 240);
    doc.text("AirTik", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.setFont("Helvetica", "italic");
    doc.setTextColor(80, 80, 80);
    doc.text("Your Ultimate Flight Experience", 105, 27, null, null, "center");

    doc.setDrawColor(220, 220, 220);
    doc.line(15, 32, 195, 32);

    if (
      ticketDetails.qrCode &&
      ticketDetails.qrCode.contentType &&
      ticketDetails.qrCode.data
    ) {
      const qrCodeImage = `data:${
        ticketDetails.qrCode.contentType
      };base64,${btoa(
        String.fromCharCode(...new Uint8Array(ticketDetails.qrCode.data.data))
      )}`;
      doc.addImage(qrCodeImage, "PNG", 170, 36, 25, 25);
    }

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`Booking ID: ${ticketDetails.ticketId}`, 15, 40);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Flight Details", 15, 50);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      `Flight Number: ${ticketDetails.flights?.flightNumber || "N/A"}`,
      15,
      57
    );
    doc.text(
      `Destination: ${ticketDetails.flights.route?.destination?.city || "N/A"}`,
      15,
      64
    );
    doc.text(
      `Departure Time: ${
        new Date(ticketDetails.flights?.departureTime).toLocaleString() || "N/A"
      }`,
      15,
      71
    );

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Passenger Details", 15, 81);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Seats Booked: ${ticketDetails.seats}`, 15, 88);
    doc.text(`Seat Numbers: ${ticketDetails.seatNumbers.join(", ")}`, 15, 95);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Payment Details", 15, 105);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Total Price: PKR ${ticketDetails.totalPrice}`, 15, 112);
    doc.text(`Payment Status: ${ticketDetails.paymentStatus}`, 15, 119);

    doc.setFont("Helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Thank you for choosing AirTik. Have a safe and pleasant journey!",
      105,
      270,
      null,
      null,
      "center"
    );

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
      <LoadingBar ref={loadProgress} color="#4A90E2" />
      <div className="w-full max-w-2xl bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-lg shadow-lg border border-gray-700">
        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-400">
            Booking Details: {ticketDetails.ticketId}
          </h2>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition duration-200"
            onClick={handleViewPDF}
          >
            <span className="material-icons">download</span>
            {/* <span>Download</span> */}
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <img
            className="w-24 h-24 object-cover rounded-md"
            src={
              ticketDetails.qrCode &&
              ticketDetails.qrCode.contentType &&
              ticketDetails.qrCode.data
                ? `data:${ticketDetails.qrCode.contentType};base64,${btoa(
                    String.fromCharCode(
                      ...new Uint8Array(ticketDetails.qrCode.data.data)
                    )
                  )}`
                : "default-image-url.jpg"
            }
            alt="QR Code"
          />
        </div>

        {/* Ticket Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-lg font-semibold text-gray-300">
              <span className="material-icons text-blue-400 mr-2">
                airplanemode_active
              </span>
              Flight Number:{" "}
              <span className="text-white">
                {ticketDetails.flights?.flightNumber || "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-300">
              <span className="material-icons text-blue-400 mr-2">
                location_on
              </span>
              Destination:{" "}
              <span className="text-white">
                {ticketDetails.flights.route?.destination?.city || "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-300">
              <span className="material-icons text-blue-400 mr-2">
                schedule
              </span>
              Departure Time:{" "}
              <span className="text-white">
                {new Date(
                  ticketDetails.flights?.departureTime
                ).toLocaleString() || "N/A"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-300">
              <span className="material-icons text-blue-400 mr-2">
                event_seat
              </span>
              Seats Booked:{" "}
              <span className="text-white">{ticketDetails.seats}</span>
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-300">
              <span className="material-icons text-blue-400 mr-2">
                confirmation_number
              </span>
              Seat Numbers:{" "}
              <span className="text-white">
                {ticketDetails.seatNumbers.join(", ")}
              </span>
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-300">
              Total Price:{" "}
              <span className="text-white">PKR {ticketDetails.totalPrice}</span>
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-300">
              <span className="material-icons text-blue-400 mr-2">
                calendar_today
              </span>
              Booking Date:{" "}
              <span className="text-white">
                {new Date(ticketDetails.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-300">
              <span className="material-icons text-blue-400 mr-2">payment</span>
              Payment Status:{" "}
              <span
                className={`${
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

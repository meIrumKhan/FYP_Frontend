import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap"; 
const UserDashboard = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (origin && destination && date) {
      navigate("/flights", {
        state: { origin, destination, date },
      });
    } else {
      alert("Please fill in all fields!");
    }
  };

  useEffect(() => {
    
    gsap.fromTo(
      ".header-text",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
    );

 
    gsap.fromTo(
      ".header-subtitle",
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, delay: 0.5, ease: "power3.out" }
    );

    gsap.fromTo(
      ".search-input",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.3, ease: "power3.out" }
    );

    gsap.fromTo(
      ".search-button",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }
    );

    gsap.fromTo(
      ".why-choose-section",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
    );

    
    gsap.fromTo(
      ".feature-box",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.3, ease: "power3.out" }
    );

    
    gsap.fromTo(
      ".feature-icon",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.5, stagger: 0.3, ease: "power3.out" }
    );


    gsap.fromTo(
      ".feature-text",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.5, stagger: 0.4, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white w-full">
      <header className="bg-gradient-to-r from-gray-800 to-gray-600 py-6">
        <div className="max-w-full mx-auto text-center">
          <h1 className="header-text text-4xl font-bold">Welcome to AirTik</h1>
          <p className="header-subtitle text-lg mt-2">
            Book your flights easily and affordably
          </p>
        </div>
      </header>

      <section className="py-12">
        <div className="max-w-full mx-auto px-6">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Search for Flights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm mb-2" htmlFor="origin">
                  Origin
                </label>
                <input
                  type="text"
                  id="origin"
                  className="search-input w-full p-3 rounded-lg bg-gray-700 text-white"
                  placeholder="Enter origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-2" htmlFor="destination">
                  Destination
                </label>
                <input
                  type="text"
                  id="destination"
                  className="search-input w-full p-3 rounded-lg bg-gray-700 text-white"
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm mb-2" htmlFor="date">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="search-input w-full p-3 rounded-lg bg-gray-700 text-white"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleSearch}
                className="search-button px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-transform transform hover:scale-105"
              >
                Search Flights
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-800 why-choose-section">
        <div className="max-w-full mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6">Why Choose AirTik?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="feature-box bg-gray-700 p-6 rounded-lg shadow-lg">
              <div className="feature-icon mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10l4 4L3 18m4-4h14m-4-4l4 4-4 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Easy Booking</h3>
              <p className="feature-text mt-2 text-gray-300">
                Simplify your travel plans with our seamless booking process.
              </p>
            </div>
            <div className="feature-box bg-gray-700 p-6 rounded-lg shadow-lg">
              <div className="feature-icon mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c3.866 0 7 3.134 7 7s-3.134 7-7 7-7-3.134-7-7 3.134-7 7-7zm0 0v3m0 4v3"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Affordable Prices</h3>
              <p className="feature-text mt-2 text-gray-300">
                Get the best deals and save money on your travels.
              </p>
            </div>
            <div className="feature-box bg-gray-700 p-6 rounded-lg shadow-lg">
              <div className="feature-icon mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19V6l7 7-7 7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">24/7 Support</h3>
              <p className="feature-text mt-2 text-gray-300">
                Our team is here to assist you at any time, day or night.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;

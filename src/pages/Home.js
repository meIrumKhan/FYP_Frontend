import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/shared/Navbar";

const HomePage = () => {
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

  const sliderImages = [
    "/assets/images/lah_isb.jpg", 
    "/assets/images/tours.jpg",
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderImages.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? sliderImages.length - 1 : prevSlide - 1
    );
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white w-full">
      <Navbar />
      {/* Slider Section */}
      <section className="relative w-full h-64 md:h-96 overflow-hidden">
        <img
          src={sliderImages[currentSlide]}
          alt={`Slide ${currentSlide + 1}`}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full text-white hover:bg-blue-500 transition"
        >
          ❮
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full text-white hover:bg-blue-500 transition"
        >
          ❯
        </button>
      </section>

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
                  className="w-full p-3 rounded-lg bg-gray-700 text-white"
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
                  className="w-full p-3 rounded-lg bg-gray-700 text-white"
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
                  className="w-full p-3 rounded-lg bg-gray-700 text-white"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-transform transform hover:scale-105"
              >
                Search Flights
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

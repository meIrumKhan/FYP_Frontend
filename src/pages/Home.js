import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import { gsap } from "gsap"; 
import SliderComp from "../components/sections/home/slider";

const HomePage = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const sliderRef = useRef(); 
  const searchFormRef = useRef(); 
  const inputRefs = {
    origin: useRef(),
    destination: useRef(),
    date: useRef(),
  }; // Refs for form inputs
  const searchButtonRef = useRef(); 
 
  useEffect(() => {
    gsap.fromTo(
      sliderRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }
    );

   
    gsap.fromTo(
      searchFormRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, delay: 0.5, ease: "power2.out" }
    );

   
    Object.keys(inputRefs).forEach((key, index) => {
      gsap.fromTo(
        inputRefs[key].current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 1 + index * 0.3, 
          ease: "power2.out",
        }
      );
    });

   
    gsap.fromTo(
      searchButtonRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, delay: 2, ease: "power2.out" }
    );
  }, []);

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
     
      <SliderComp
        sliderImages={sliderImages}
        currentSlide={currentSlide}
        handlePrevSlide={handlePrevSlide}
        handleNextSlide={handleNextSlide}
        sliderRef={sliderRef}
      />

      {/* Search Form Section */}
      <section className="py-12" ref={searchFormRef}>
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
                  ref={inputRefs.origin}
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
                  ref={inputRefs.destination}
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
                  ref={inputRefs.date}
                  className="w-full p-3 rounded-lg bg-gray-700 text-white"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleSearch}
                ref={searchButtonRef}
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

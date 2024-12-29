import React from "react";

const SliderComp = ({
  sliderImages,
  currentSlide,
  sliderRef,
  handlePrevSlide,
  handleNextSlide,
}) => {
  return (
    <section
      className="relative w-full h-64 md:h-96 overflow-hidden"
      ref={sliderRef}
    >
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
  );
};

export default SliderComp;

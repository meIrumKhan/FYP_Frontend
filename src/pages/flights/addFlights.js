import { useFormik } from "formik";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserRoleContext } from "../../context/Context";
import { toastDisplay } from "../../components/lib/functions";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";
import Button from "../../components/elements/Button";
import InputField from "../../components/elements/InputField";
import { FlightsSchema } from "../../components/lib/validation/Schemas";

const AddFlight = () => {
  const loadProgress = useRef(null);
  const { logout } = useContext(UserRoleContext);
  const [allroutes, setallRoutes] = useState([]);
  const [allairlines, setallAirlines] = useState([]);
  const navigate = useNavigate();

  const handleFetch = useCallback(
    async (method, url, body, form) => {
      loadProgress.current?.continuousStart();
      try {
        const result = await Fetchdata(method, url, body, form);

        if (result.login === false) {
          logout();
          navigate("/login");
        }

        if(result.routes){
          setallRoutes(result.routes)
        }

        if(result.airlines){
          setallAirlines(result.airlines)
        }

        if (result.success) {
          toastDisplay(result.message, "success");
        } else {
          toastDisplay(result.message, "error");
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

   useEffect(() => {
      handleFetch("GET", "/addflights");
    }, []);

  

  const formik = useFormik({
    initialValues: {
      airline: "",
      route: "",
      flightNumber: "",
      departureTime: "",
      departureDate: "",
      total: 0,
      price: 0,
    },
    validationSchema: FlightsSchema,
    onSubmit: async (values) => {
    
      await handleFetch("POST", "/addflight", values, false);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoadingBar ref={loadProgress} color="#4A90E2" />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Add Flight
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
            <label className="block text-sm font-medium text-gray-600">
                Select Route
              </label>
              <select
                name="route"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id={"route"}
                value={formik.values.route}
                onChange={formik.handleChange}
              >
                <option value="">Select Origin</option>
                {allroutes.map((key, index) => (
                  <option key={index} value={key._id}>
                    {`${key.origin}, ${key.destination}`}
                  </option>
                ))}
              </select>
              {formik.touched.route && formik.errors.route && (
                <div className="text-sm text-red-500">
                  {formik.errors.route}
                </div>
              )}
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-600">
                Select Airline
              </label>
              <select
                name="airline"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id={"airline"}
                value={formik.values.airline}
                onChange={formik.handleChange}
              >
                <option value="">Select Airline</option>
                {allairlines.map((key, index) => (
                  <option key={index} value={key._id}>
                    {`${key.airline}, ${key.code}`}
                  </option>
                ))}
              </select>
              {formik.touched.airline && formik.errors.airline && (
                <div className="text-sm text-red-500">
                  {formik.errors.airline}
                </div>
              )}
            </div>

           

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Departure date
              </label>
              <InputField
                name="departureDate"
                placeholder="Enter departure date"
                type="date"
                value={formik.values.departureDate}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {formik.touched.departureDate && formik.errors.departureDate && (
                <div className="text-red-500 text-sm">
                  {formik.errors.departureDate}
                </div>
              )}
            </div>


            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Departure time
              </label>
              <InputField
                name="departureTime"
                placeholder="Enter departure time"
                type="time"
                value={formik.values.departureTime}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {formik.touched.departureTime && formik.errors.departureTime && (
                <div className="text-red-500 text-sm">
                  {formik.errors.departureTime}
                </div>
              )}
            </div>

           
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Flight Number
              </label>
              <InputField
                name="flightNumber"
                placeholder="Enter flight name"
                type="text"
                value={formik.values.flightNumber}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {formik.touched.flightNumber && formik.errors.flightNumber && (
                <div className="text-red-500 text-sm">
                  {formik.errors.flightNumber}
                </div>
              )}
            </div>


            {/* seats */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Total Seats
              </label>
              <InputField
                name="total"
                placeholder="Enter total seats"
                type="number"
                value={formik.values.total}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {formik.touched.total && formik.errors.total && (
                <div className="text-red-500 text-sm">
                  {formik.errors.total}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Price
              </label>
              <InputField
                name="price"
                placeholder="Enter price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {formik.touched.price && formik.errors.price && (
                <div className="text-red-500 text-sm">
                  {formik.errors.price}
                </div>
              )}
            </div>

          
          </div>

          <Button
            innerText="Submit"
            className="w-full py-3 text-white bg-gray-800 rounded-lg hover:bg-gray-700 shadow-gray-800"
          />
        </form>
      </div>
    </div>
  );
};

export default AddFlight;

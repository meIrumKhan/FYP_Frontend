import { useFormik } from "formik";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import LoadingBar from "react-top-loading-bar";
import { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { UserRoleContext } from "../../context/Context";
import { RouteSchema } from "../../components/lib/validation/Schemas";
import { toastDisplay } from "../../components/lib/functions";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";
import InputField from "../../components/elements/InputField";
import Button from "../../components/elements/Button";


const UpdateRoute = () => {
  const loadProgress = useRef(null);
  const { logout } = useContext(UserRoleContext);

  const navigate = useNavigate();
  const location = useLocation();
  const initalStateValue = location.state;
  const [originCities, setOriginCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);

  const handleFetch = useCallback(
    async (method, url, body, form) => {
      loadProgress.current?.continuousStart();
      try {
        const result = await Fetchdata(method, url, body, form);

        if (result.login === false) {
          logout();
          navigate("/login");
        }

        if (result.locations) {
          setDestinationCities(result.locations);
          setOriginCities(result.locations);
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



  const formik = useFormik({
    initialValues: {
      _id: initalStateValue?._id || "",
      origin: initalStateValue?.origin || "",
      destination: initalStateValue?.destination || "",
      duration: initalStateValue?.duration || "",
      distance: initalStateValue?.distance || 0,
    },
    validationSchema: RouteSchema,
    onSubmit: async (values) => {
      
      try {
              if (values.origin === values.destination) {
                toastDisplay("Origin and Destination cannot be the same.", "error");
                return;
              }
              await handleFetch("POST", "/editflightroute", { ...values }, false);
            } catch (e) {
              toastDisplay(e.message, "error");
            }
    },
  });

  useEffect(() => {
    if (!location.state || !location.state._id) {
      navigate("/routes");
    }else{
      handleFetch("GET", "/getalllocations");
    }
   
  
  }, [navigate, location]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <LoadingBar ref={loadProgress} color="#4A90E2" />
    <Toaster position="top-right" reverseOrder={false} />
    <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        Update Route
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
          <label className="block text-sm font-medium text-gray-600">
                Select Origin
              </label>
              <select
                name="origin"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id={"origin"}
                value={formik.values.origin}
                onChange={formik.handleChange}
              >
                <option value="">Select Origin</option>
                {originCities.map((key, index) => (
                  <option key={index} value={key.city}>
                    {`${key.city}, ${key.country}`}
                  </option>
                ))}
              </select>
              {formik.touched.origin && formik.errors.origin && (
                <div className="text-sm text-red-500">
                  {formik.errors.origin}
                </div>
              )}
          </div>

          <div>
          <label className="block text-sm font-medium text-gray-600">
                Select Destination
              </label>
              <select
                name="destination"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id={"destination"}
                value={formik.values.destination}
                onChange={formik.handleChange}
              >
                <option value="">Select Destination</option>
                {destinationCities.map((key, index) => (
                  <option key={index} value={key.city}>
                    {`${key.city}, ${key.country}`}
                  </option>
                ))}
              </select>
              {formik.touched.destination && formik.errors.destination && (
                <div className="text-sm text-red-500">
                  {formik.errors.destination}
                </div>
              )}
          </div>

          <div>
          <label className="block text-sm font-medium text-gray-600">
                Duration
              </label>
              <InputField
                name="duration"
                placeholder="Enter Duration"
                type="text"
                value={formik.values.duration}
                onChange={formik.handleChange}
              />
              {formik.touched.duration && formik.errors.duration && (
                <div className="text-sm text-red-500">
                  {formik.errors.duration}
                </div>
              )}
          </div>

          <div>
          <label className="block text-sm font-medium text-gray-600">
                Distance
              </label>
              <InputField
                name="distance"
                placeholder="Enter Distance in km/h"
                type="number"
                value={formik.values.distance}
                onChange={formik.handleChange}
              />
              {formik.touched.distance && formik.errors.distance && (
                <div className="text-sm text-red-500">
                  {formik.errors.distance}
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

export default UpdateRoute;

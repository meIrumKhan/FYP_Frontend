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
import { useNavigate } from "react-router-dom";
import { UserRoleContext } from "../../context/Context";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";
import { toastDisplay } from "../../components/lib/functions";
import { RouteSchema } from "../../components/lib/validation/Schemas";
import InputField from "../../components/elements/InputField";
import Button from "../../components/elements/Button";

const AddRoute = () => {
  const loadProgress = useRef(null);
  const { logout } = useContext(UserRoleContext);
  const navigate = useNavigate();
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

        if (result.message) {
          toastDisplay(result.message, result.success && "success");
        } 

        if (result.locations) {
          setDestinationCities(result.locations);
          setOriginCities(result.locations);
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
    handleFetch("GET", "/getalllocations");
  }, []);

  const formik = useFormik({
    initialValues: {
      origin: "",
      destination: "",
      duration: "",
      distance: 0,
    },
    validationSchema: RouteSchema,
    onSubmit: async (values) => {
      try {
        if (values.origin === values.destination) {
          toastDisplay("Origin and Destination cannot be the same.", "error");
          return;
        }
        await handleFetch("POST", "/addflightroute", { ...values }, false);
      } catch (e) {
        toastDisplay(e.message, "error");
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoadingBar ref={loadProgress} color="#4A90E2" />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Add Route
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Select Origin
              </label>
              {/* <select
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
              </select> */}
              <select
                name="origin"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id={"origin"}
                value={formik.values.origin}
                onChange={formik.handleChange}
              >
                <option value="">Select Origin</option>
                {originCities.map((key, index) => (
                  <option key={index} value={key._id}>
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
              {/* <select
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
              </select> */}
              <select
                name="destination"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id={"destination"}
                value={formik.values.destination}
                onChange={formik.handleChange}
              >
                <option value="">Select Destination</option>
                {destinationCities.map((key, index) => (
                  <option key={index} value={key._id}>
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

export default AddRoute;

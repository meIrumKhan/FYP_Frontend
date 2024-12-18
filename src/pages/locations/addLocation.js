import { useFormik } from "formik";
import React, { useCallback, useContext, useRef } from "react";
import LoadingBar from "react-top-loading-bar";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserRoleContext } from "../../context/Context";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";
import { toastDisplay } from "../../components/lib/functions";
import { LocationSchema } from "../../components/lib/validation/Schemas";
import InputField from "../../components/elements/InputField";
import Button from "../../components/elements/Button";

const AddLocation = () => {
  const loadProgress = useRef(null);
  const { logout } = useContext(UserRoleContext);
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
      city: "",
      country : ""
    },
    validationSchema: LocationSchema,
    onSubmit: async (values) => {
      await handleFetch("POST", "/addlocation", values, false);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <LoadingBar ref={loadProgress} color="#3b82f6" />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Add Location
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                City
              </label>
              <InputField
                name="city"
                placeholder="Enter city name"
                type="text"
                value={formik.values.city}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {formik.touched.city && formik.errors.city && (
                <div className="text-red-500 text-sm">{formik.errors.city}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Country
              </label>
              <InputField
                name="country"
                placeholder="Enter country name"
                type="text"
                value={formik.values.country}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {formik.touched.country && formik.errors.country && (
                <div className="text-red-500 text-sm">{formik.errors.country}</div>
              )}
            </div>

           
          </div>

          <Button
            innerText="Add Item"
            className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          />
        </form>
      </div>
    </div>
  );
};

export default AddLocation;

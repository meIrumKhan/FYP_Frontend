import { useFormik } from "formik";
import React, { useCallback, useContext, useRef, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserRoleContext } from "../../context/Context";
import InputField from "../../components/elements/InputField";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";
import { toastDisplay } from "../../components/lib/functions";
import { AirlineSchema } from "../../components/lib/validation/Schemas";
import Button from "../../components/elements/Button";

const AddAirline = () => {
  const loadProgress = useRef(null);
  const { logout } = useContext(UserRoleContext);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    formik.setFieldValue("image", file);
  };

  const formik = useFormik({
    initialValues: {
      airline: "",
      image: null,
      code: "",
    },
    validationSchema: AirlineSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("airline", values.airline);
      formData.append("code", values.code);
      formData.append("image", values.image);

      await handleFetch("POST", "/addairline", formData, true);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoadingBar ref={loadProgress} color="#4A90E2" />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Add Airline
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Airline Name
              </label>
              <InputField
                name="airline"
                placeholder="Enter airline name"
                type="text"
                value={formik.values.airline}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {formik.touched.airline && formik.errors.airline && (
                <div className="text-red-500 text-sm">
                  {formik.errors.airline}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Airline Code
              </label>
              <InputField
                name="code"
                placeholder="Enter airline code"
                type="text"
                value={formik.values.code}
                onChange={formik.handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              {formik.touched.code && formik.errors.code && (
                <div className="text-red-500 text-sm">{formik.errors.code}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
              Image
              </label>
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Selected Item"
                  className="h-32 w-32 object-cover rounded-lg border mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
              {formik.touched.image && formik.errors.image && (
                <div className="text-red-500 text-sm">
                  {formik.errors.image}
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

export default AddAirline;

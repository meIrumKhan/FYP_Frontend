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
import { toastDisplay } from "../../components/lib/functions";
import InputField from "../../components/elements/InputField";
import Button from "../../components/elements/Button";
import { AirlineSchema } from "../../components/lib/validation/Schemas";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";

const UpdateAirline = () => {
  const loadProgress = useRef(null);
  const { logout } = useContext(UserRoleContext);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const initalStateValue = location.state;

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
      _id: initalStateValue?._id || "",
      code: initalStateValue?.code || "",
      image: initalStateValue?.image || "",
      airline: initalStateValue?.airline || "",
     
    },
    validationSchema: AirlineSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("id", values._id);
      formData.append("airline", values.airline);
      formData.append("code", values.code);
      

      if (values.image instanceof File) {
        formData.append("image", values.image);
      } else if (
        values.image &&
        values.image.data &&
        values.image.contentType
      ) {
        formData.append("existingImageData", JSON.stringify(values.image.data));
        formData.append("existingImageContentType", values.image.contentType);
      }

      await handleFetch("POST", "/editairline", formData, true);
    },
  });

  useEffect(() => {
    if (!location.state || !location.state._id) {
      navigate("/airlines");
    } else {
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(initalStateValue.image.data.data))
      );
      setSelectedImage(
        `data:${initalStateValue.image.contentType};base64,${base64String}`
      );
    }
  }, [navigate, location, setSelectedImage, initalStateValue]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <LoadingBar ref={loadProgress} color="#4A90E2" />
    <Toaster position="top-right" reverseOrder={false} />
    <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        Update Airline
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

export default UpdateAirline;

import { useFormik } from "formik";
import React, { useCallback, useContext, useRef } from "react";
import LoadingBar from "react-top-loading-bar";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserRoleContext } from "../../context/Context";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";
import { toastDisplay, validatePassword } from "../../components/lib/functions";
import { SignUpShema } from "../../components/lib/validation/Schemas";
import InputField from "../../components/elements/InputField";
import Button from "../../components/elements/Button";

const AddUser = () => {
  const loadProgress = useRef(null);
  const { logout } = useContext(UserRoleContext);
  const navigate = useNavigate();

  const userType = [{
    name : 'admin',
    isAdmin : true
   }, {
    name : 'user',
    isAdmin : false
   }]

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
      email: "",
      password: "",
      name: "",
      type: "",
      isAdmin: false
    },
    validationSchema: SignUpShema,
    onSubmit: async (values) => {
      const Password = validatePassword(values.password);
      if (Password.isValid) {
        await handleFetch("POST", "/signup", { ...values }, false);
      } else {
        toastDisplay(Password.message, "error");
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoadingBar ref={loadProgress} color="#4A90E2" />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Add User
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Name
              </label>
              <InputField
                name="name"
                placeholder="Enter name"
                type="text"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-sm text-red-500">{formik.errors.name}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <InputField
                name="email"
                placeholder="Enter email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-sm text-red-500">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Phone
              </label>
              <InputField
                name="phno"
                placeholder="Enter phone number"
                type="number"
                value={formik.values.phno}
                onChange={formik.handleChange}
              />
              {formik.touched.phno && formik.errors.phno && (
                <div className="text-sm text-red-500">{formik.errors.phno}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Select Usertype
              </label>
              <select
                name="isAdmin"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id={"isAdmin"}
                value={formik.values.isAdmin}
                onChange={formik.handleChange}
              >
                <option value="">Select Type</option>
                {userType.map((key, index) => (
                  <option key={index} value={key.isAdmin}>
                    {key.name}
                  </option>
                ))}
              </select>
              {formik.touched.isAdmin && formik.errors.isAdmin && (
                <div className="text-sm text-red-500">{formik.errors.isAdmin}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <InputField
                name="password"
                placeholder="Enter password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-sm text-red-500">
                  {formik.errors.password}
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

export default AddUser;

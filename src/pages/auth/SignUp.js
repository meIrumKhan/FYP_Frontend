import React, { useCallback, useRef, useEffect } from "react";
import { SignUpShema } from "../../components/lib/validation/Schemas";
import { useFormik } from "formik";
import LoadingBar from "react-top-loading-bar";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";
import { Link } from "react-router-dom";
import { toastDisplay, validatePassword } from "../../components/lib/functions";
import { Toaster } from "react-hot-toast";
import { gsap } from "gsap";

const SignupPage = () => {
  const loadProgress = useRef(null);
  const formRef = useRef(null);

  const handleFetch = useCallback(async (method, url, body, form) => {
    if (loadProgress.current) {
      loadProgress.current.continuousStart();
    }
    try {
      const result = await Fetchdata(method, url, body, form);
      if (result.success) {
        toastDisplay(result.message, true);
      } else {
        toastDisplay(result.message, false);
      }
      return result;
    } catch (e) {
      console.log(e.message);
    } finally {
      if (loadProgress.current) {
        loadProgress.current.complete();
      }
    }
  }, []);

  const InitialValues = {
    email: "",
    password: "",
    name: "",
    phno: 0,
    isAdmin: false,
  };

  const formik = useFormik({
    initialValues: InitialValues,
    validationSchema: SignUpShema,
    onSubmit: async (values) => {
      const Password = validatePassword(values.password);
      if (Password.isValid) {
        await handleFetch("POST", "/signup", { ...values }, false);
        console.log(values);
      } else {
        toastDisplay(Password.message, "error");
      }
    },
  });

  useEffect(() => {
   
    const timeline = gsap.timeline({ defaults: { duration: 0.8, ease: "power3.out" } });

    timeline
      .fromTo(
        ".signup-container",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1 }
      )
      .fromTo(
        ".signup-header",
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0 },
        "-=0.8"
      )
      .fromTo(
        ".signup-form .form-item",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, stagger: 0.3 },
        "-=0.5"
      )
      .fromTo(
        ".signup-form button",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1 },
        "-=0.5"
      )
      .fromTo(
        ".signup-footer",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0 },
        "-=0.5"
      );
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-2 md:p-0">
      <LoadingBar ref={loadProgress} color="#f11946" />
      <Toaster position="top-right" reverseOrder={false} />
      <div
        ref={formRef}
        className="signup-container bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="signup-header text-2xl font-bold mb-6 text-center">
          Sign Up
        </h2>
        <form onSubmit={formik.handleSubmit} className="signup-form mt-4">
          <div className="flex flex-wrap gap-5 justify-center mb-2">
            <div className="form-item">
              <label className="block text-sm font-medium mb-2" htmlFor="name">
                Your's Name
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg"
                type={"text"}
                id={"name"}
                name={"name"}
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-danger">{formik.errors.name}</div>
              ) : null}
            </div>
            <div className="form-item">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="userEmail"
              >
                Your's Email
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg"
                type={"email"}
                id={"email"}
                name={"email"}
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-danger">{formik.errors.email}</div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-5 justify-center mb-2">
            <div className="form-item mb-4">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="userPhno"
              >
                Your's Phno
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg"
                type={"number"}
                id={"phno"}
                name={"phno"}
                value={formik.values.phno}
                onChange={formik.handleChange}
              />
              {formik.touched.phno && formik.errors.phno ? (
                <div className="text-danger">{formik.errors.phno}</div>
              ) : null}
            </div>

            <div className="form-item mb-4">
              <label
                className="block text-sm font-medium mb-2"
                htmlFor="storePassword"
              >
                Your's Password
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-lg"
                type={"password"}
                id={"password"}
                name={"password"}
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-danger">{formik.errors.password}</div>
              ) : null}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="form-item bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-[8px] w-full text-white font-medium transition-transform transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        </form>
        <h5 className="signup-footer h5 text-large text-center p-3">
          <Link className="text-blue-500 font-bold" to={"/signin"}>
            Sign In
          </Link>{" "}
          now!
        </h5>
      </div>
    </div>
  );
};

export default SignupPage;

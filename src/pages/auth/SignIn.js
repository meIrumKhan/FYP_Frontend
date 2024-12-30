import React, { useCallback, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";
import { SignInSchema } from "../../components/lib/validation/Schemas";
import { useFormik } from "formik";
import { UserRoleContext } from "../../context/Context";
import { toastDisplay } from "../../components/lib/functions";
import { Toaster } from "react-hot-toast";
import { gsap } from "gsap";

const SigninPage = () => {
  const loadProgress = useRef(null);
  const navigate = useNavigate();
  const { setUserProfile, login } = useContext(UserRoleContext);
  const formRef = useRef(null);

  const handleFetch = useCallback(
    async (method, url, body) => {
      if (loadProgress.current) {
        loadProgress.current.continuousStart();
      }
      try {
        const result = await Fetchdata(method, url, body);

        if (result.success) {
          login();
          setUserProfile({
            name: result.user.name,
            email: result.user.email,
            isAdmin: result.user.isAdmin,
            phno: result.user.phno,
          });
          navigate("/");
        }
        if (result.login === false) {
          toastDisplay(result.message, "error");
        }
        return result;
      } catch (e) {
        console.log(e.message);
      } finally {
        if (loadProgress.current) {
          loadProgress.current.complete();
        }
      }
    },
    [navigate, login, setUserProfile]
  );

  const InitialValues = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: InitialValues,
    validationSchema: SignInSchema,
    onSubmit: async (values) => {
      await handleFetch("POST", "/login", { ...values });
    },
  });

  useEffect(() => {
 
    const timeline = gsap.timeline({ defaults: { duration: 0.8, ease: "power3.out" } });

    timeline
      .fromTo(
        ".signin-container",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0 }
      )
      .fromTo(
        ".signin-header",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0 },
        "-=0.8"
      )
      .fromTo(
        ".signin-form .form-item",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, stagger: 0.3 },
        "-=0.5"
      )
      .fromTo(
        ".signin-form button",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1 },
        "-=0.5"
      )
      .fromTo(
        ".signin-footer",
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
        className="signin-container bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="signin-header text-2xl font-bold mb-6 text-center">
          Sign In
        </h2>
        <form onSubmit={formik.handleSubmit} className="signin-form mt-4">
          <div className="form-item mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Enter Email
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
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="form-item mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="password"
            >
              Enter Password
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
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            ) : null}
          </div>

          <button
            type="submit"
            className="form-item bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-lg w-full text-white font-medium transition-transform transform hover:scale-105"
          >
            Sign in
          </button>
        </form>
        <h5 className="signin-footer h5 text-large text-center p-3">
          If not registered,{" "}
          <Link className="text-blue-500 font-bold" to={"/signup"}>
            Sign-Up
          </Link>{" "}
          now!
        </h5>
      </div>
    </div>
  );
};

export default SigninPage;

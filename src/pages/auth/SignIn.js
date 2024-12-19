import React, { useCallback, useContext, useRef } from "react";
import {
  Link,
  // Link,
  useNavigate,
} from "react-router-dom";

import LoadingBar from "react-top-loading-bar";
import { AuthFetchdata } from "../../components/lib/handleFetch/FetchData";
import { SignInSchema } from "../../components/lib/validation/Schemas";
import { useFormik } from "formik";
import { UserRoleContext } from "../../context/Context";
import { toastDisplay } from "../../components/lib/functions";
import { Toaster } from "react-hot-toast";

const SigninPage = () => {
  const loadProgress = useRef(null);
  const navigate = useNavigate();
  const { setUserProfile, login } =
    useContext(UserRoleContext);

  const handleFetch = useCallback(
    async (method, url, body) => {
      if (loadProgress.current) {
        loadProgress.current.continuousStart();
      }
      try {
        const result = await AuthFetchdata(method, url, body);
       
        if (result.success) {
          login()
          setUserProfile({
            name: result.user.name,
            email: result.user.email,
            isAdmin: result.user.isAdmin,
            phno: result.user.phno,
          })
          navigate("/");
        }
        if (result.login === false){
          toastDisplay(result.message, 'error')
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

  // const checkAuth = useCallback(async () => {
  //   loadProgress.current?.continuousStart();
  //   try {
  //     const resp = await Fetchdata("GET", "/check-auth");
  //     if (resp.login === true) {
  //       setUserProfile({
  //         name: resp.name,
  //         type: resp.type,
  //       });
  //       setCategoryList(resp.categories);
  //       setItemsList(resp.items);
  //       setOrdersList(resp.orders);
  //       setUserPoints(resp.reward_point)
  //       setUsersList(resp.users)
  //       setAllOrders(resp.all_orders)
  //       setTablesList(resp.tables)

  //       await login();
  //       navigate("/");
  //     } else {
  //       logout();
  //     }
  //   } catch (error) {
  //     logout();
  //   } finally {
  //     loadProgress.current?.complete();
  //   }
  // }, [
  //   logout,
  //   login,
  //   navigate,
  //   setUserProfile,
  //   setCategoryList,
  //   setItemsList,
  //   setOrdersList,
  //   setUserPoints,
  //   setUsersList,
  //   setAllOrders,
  //   setTablesList,
  // ]);

  // useEffect(() => {
  //   checkAuth();
  // }, [checkAuth]);

  const InitialValues = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: InitialValues,
    validationSchema: SignInSchema,
    onSubmit: async (values) => {
      // console.log({ values });
      await handleFetch("POST", "/login", { ...values });
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-2 md:p-0">
      <LoadingBar ref={loadProgress} color="#f11946" />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={formik.handleSubmit} className="mt-4">
          <div className="mb-4">
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
              <div className="text-danger">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="mb-4">
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
              <div className="text-danger">{formik.errors.password}</div>
            ) : null}
          </div>

          <button
           type="submit"
            className={
              "bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-[8px] w-full text-white font-medium"
            }
          >
            Sign in
          </button>
        </form>
        <h5 className="h5 text-large text-center p-3">
          If not registerd{" "}
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

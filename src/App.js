import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import SigninPage from "./pages/auth/SignIn";
import SignupPage from "./pages/auth/SignUp";
import LocationLayout from "./layout/locationLayout";
import AddLocation from "./pages/locations/addLocation";
import NotFoundPage from "./pages/NotFound";
import { UserRoleContext } from "./context/Context";
import { useContext, useEffect } from "react";
import GETLocations from "./pages/locations/getLocations";
import UsersLayout from "./layout/usersLayout";
import GETUsers from "./pages/users/getUser";
import AddUser from "./pages/users/addUser";
import AddRoute from "./pages/routes/addRoute";
import RoutesLayout from "./layout/routeLayout";
import GETRoutes from "./pages/routes/getRoute";
import UpdateRoute from "./pages/routes/routeUpdate";
import AddAirline from "./pages/airlines/addAirline";
import AirlineLayout from "./layout/airlineLayout";
import GETAirlines from "./pages/airlines/getAirlines";
import UpdateAirline from "./pages/airlines/updateAirline";
import FlightLayout from "./layout/flightLayout";
import AddFlight from "./pages/flights/addFlights";
import GETFlights from "./pages/flights/getFlights";
import UpdateFlight from "./pages/flights/updateFlights";
import UserFlights from "./pages/flights/userFlights";
import HomePage from "./pages/Home";
import AdminLayout from "./layout/adminLayout";
import UserDashboard from "./pages/dashboard/userDashboard";
import AdminDashboard from "./pages/dashboard/adminDashboard";
import BookFlight from "./pages/bookings/bookFlight";
import UserBooking from "./pages/bookings/userBookings";
import AdminBooking from "./pages/bookings/adminBooking";
import { AuthFetchdata } from "./components/lib/handleFetch/FetchData";
import AdminUserLayout from "./layout/adminUserLayout";


function App() {
  const { isLoggedIn, login, userProfile, setUserProfile } = useContext(UserRoleContext);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await AuthFetchdata("GET", "/check-auth");

        if (result.success && result.login) {
          login()
          setUserProfile({
            name: result.user.name,
            email: result.user.email,
            isAdmin: result.user.isAdmin,
            phno: result.user.phno,
          });
        } else {
          
          setUserProfile({
            name: "",
            email: "",
            isAdmin: false,
            phno: "",
          });
        }
      } catch (error) {
        console.error("Error checking auth:", error.message);
       
      }
    };

    checkAuth();
  }, [login, setUserProfile]);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Home Page */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              userProfile.isAdmin ? (
                <Navigate to="/admin/dashboard" />
              ) : (
                <Navigate to="/user/dashboard" />
              )
            ) : (
              <HomePage />
            )
          }
        />

        {/* Admin Routes */}
        {isLoggedIn && userProfile.isAdmin && (
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="location" element={<LocationLayout />}>
              <Route index element={<GETLocations />} />
              <Route path="add" element={<AddLocation />} />
            </Route>
            <Route path="user" element={<AdminUserLayout />}>
              <Route index element={<GETUsers />} />
              <Route path="add" element={<AddUser />} />
            </Route>
            <Route path="routes" element={<RoutesLayout />}>
              <Route index element={<GETRoutes />} />
              <Route path="add" element={<AddRoute />} />
              <Route path="update" element={<UpdateRoute />} />
            </Route>
            <Route path="airlines" element={<AirlineLayout />}>
              <Route index element={<GETAirlines />} />
              <Route path="add" element={<AddAirline />} />
              <Route path="update" element={<UpdateAirline />} />
            </Route>
            <Route path="flights" element={<FlightLayout />}>
              <Route index element={<GETFlights />} />
              <Route path="add" element={<AddFlight />} />
              <Route path="update" element={<UpdateFlight />} />
            </Route>
            <Route path="bookings" element={<AdminBooking />} />
          </Route>
        )}

        <Route path="flights" element={<UserFlights />} />

        {/* User Routes */}
        {isLoggedIn && !userProfile.isAdmin && (
          <Route path="/user" element={<UsersLayout />}>
             <Route path="dashboard" element={<UserDashboard />} />
             <Route path="book" element={<BookFlight />} />
             <Route path="bookings" element={<UserBooking />} />
          </Route>
        )}

        {/* Fallback Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;

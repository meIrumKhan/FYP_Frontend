import React, { useEffect, useState } from "react";
import { Fetchdata } from "../../components/lib/handleFetch/FetchData";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalFlights: 0,
    totalBookings: 0,
    totalAirlines: 0,
    totalLocations: 0,
  });

  // Fetch the statistics when the component loads
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await Fetchdata("GET", "/admindashboard");

        if (response.success && response.stats) {
          setStats(response.stats);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Dashboard Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, Admin! Here's an overview of your system.</p>
      </header>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-600 font-medium">Total Bookings</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-600 font-medium">Total Flights</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.totalFlights}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-600 font-medium">Total Airlines</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.totalAirlines}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-600 font-medium">Total Locations</h3>
          <p className="text-2xl font-bold text-gray-800">{stats.totalLocations}</p>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

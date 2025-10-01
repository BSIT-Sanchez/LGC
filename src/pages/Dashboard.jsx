import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { FaUser, FaCalendarAlt, FaUsers, FaBoxes } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    staff: 0,
    inventory: 0,
  });

  const [today, setToday] = useState("");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard/stats");
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);

          setChartData({
            labels: ["Patients", "Appointments", "Staff", "Inventory"],
            datasets: [
              {
                label: "Count",
                data: [
                  data.stats.patients,
                  data.stats.appointments,
                  data.stats.staff,
                  data.stats.inventory,
                ],
                backgroundColor: ["#ec4899", "#f472b6", "#fbbf24", "#34d399"],
                borderRadius: 5,
              },
            ],
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();

    const todayDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setToday(todayDate);
  }, []);

  return (
    <Layout>
      {/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
  <div className="bg-white rounded-xl shadow border border-pink-100 p-5 flex items-center gap-3">
    <FaUser className="text-pink-500 text-3xl" />
    <div>
      <p className="text-xs text-gray-500">Total Patients</p>
      <div className="mt-1 text-4xl font-extrabold text-pink-700">{stats.patients}</div>
    </div>
  </div>

  <div className="bg-white rounded-xl shadow border border-pink-100 p-5 flex items-center gap-3">
    <FaCalendarAlt className="text-pink-500 text-3xl" />
    <div>
      <p className="text-xs text-gray-500">Total Appointments</p>
      <div className="mt-1 text-4xl font-extrabold text-pink-700">{stats.appointments}</div>
    </div>
  </div>

  <div className="bg-white rounded-xl shadow border border-pink-100 p-5 flex items-center gap-3">
    <FaUsers className="text-pink-500 text-3xl" />
    <div>
      <p className="text-xs text-gray-500">Total Staff</p>
      <div className="mt-1 text-4xl font-extrabold text-pink-700">{stats.staff}</div>
    </div>
  </div>

  <div className="bg-white rounded-xl shadow border border-pink-100 p-5 flex items-center gap-3">
    <FaBoxes className="text-pink-500 text-3xl" />
    <div>
      <p className="text-xs text-gray-500">Inventory Items</p>
      <div className="mt-1 text-4xl font-extrabold text-pink-700">{stats.inventory}</div>
    </div>
  </div>
</div>

      {/* Graph */}
      <div className="bg-white rounded-xl shadow border border-pink-100 p-5 mb-6">
        <h2 className="text-lg font-semibold text-pink-700 mb-4">Clinic Overview</h2>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Clinic Stats" },
            },
          }}
        />
      </div>

      {/* Today's Date */}
      <div className="text-gray-700 font-bold mt-4">
        Today: <span id="todayDate">{today}</span>
      </div>
    </Layout>
  );
};

export default Dashboard;

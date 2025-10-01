import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiMenu,
  FiGrid,
  FiFolder,
  FiCalendar,
  FiCreditCard,
  FiUsers,
  FiPackage,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiUser,
  FiSearch,
} from "react-icons/fi";

const Layout = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // ✅ Sidebar toggle
  const navigate = useNavigate();

  // Load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success(data.msg || "Logged out successfully");
        navigate("/");
      } else {
        toast.error(data.msg || "Error logging out");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error logging out");
    }
  };

  return (
    <div className="bg-pink-50 font-sans min-h-screen flex flex-col">
      <ToastContainer />
      {/* Top Navbar */}
      <header className="bg-pink-400 text-white shadow px-6 py-3 flex justify-between items-center relative">
        <div className="flex items-center gap-3">
          <button
            className="focus:outline-none"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} // ✅ toggle sidebar
          >
            <FiMenu className="text-2xl" />
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <img
              src="/images/LGC's LOGO.jpg"
              alt="LGC Care Maternity"
              className="h-8 w-8 rounded-full ring-2 ring-white/70 object-cover"
            />
            <div className="leading-tight">
              <div className="text-lg font-extrabold tracking-wide">
                LGC CARE MATERNITY
              </div>
              <div className="text-[11px] -mt-0.5 opacity-90">MEDICAL CLINIC</div>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4 relative">
          <label className="hidden md:flex items-center gap-2 bg-white/90 text-gray-700 rounded-full px-3 py-1.5">
            <FiSearch className="text-lg opacity-70" />
            <input
              className="bg-transparent outline-none text-sm placeholder-gray-500"
              placeholder="Search..."
            />
          </label>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="h-9 w-9 grid place-items-center rounded-full bg-white/30 hover:bg-white/40 transition"
            >
              <FiUser className="text-xl" />
            </button>

            {isProfileOpen && user && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-semibold">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-pink-50 transition"
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleLogout();
                  }}
                >
                  <FiLogOut className="text-lg" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`bg-pink-400 text-white flex flex-col justify-between min-h-screen transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
          }`}
        >
          {isSidebarOpen && (
            <div>
              <h2 className="text-sm font-bold px-6 pt-6 pb-2 border-b border-pink-300 uppercase tracking-wide">
                Clinic Menu
              </h2>
              <nav className="mt-4">
              <ul className="space-y-1 text-sm">
                <li>
                  <NavLink
                    to="/Dashboard"
                    end
                    className={({ isActive }) =>
                      `flex items-center px-6 py-3 rounded-r-full transition ${
                        isActive
                          ? "bg-pink-500 font-semibold"
                          : "hover:bg-pink-500"
                      }`
                    }
                  >
                    <FiGrid className="text-xl mr-2" /> Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/patients"
                    className={({ isActive }) =>
                      `flex items-center px-6 py-3 rounded-r-full transition ${
                        isActive
                          ? "bg-pink-500 font-semibold"
                          : "hover:bg-pink-500"
                      }`
                    }
                  >
                    <FiFolder className="text-xl mr-2" /> Patients Records
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/appointments"
                    className={({ isActive }) =>
                      `flex items-center px-6 py-3 rounded-r-full transition ${
                        isActive
                          ? "bg-pink-500 font-semibold"
                          : "hover:bg-pink-500"
                      }`
                    }
                  >
                    <FiCalendar className="text-xl mr-2" /> Appointment
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/billing"
                    className={({ isActive }) =>
                      `flex items-center px-6 py-3 rounded-r-full transition ${
                        isActive
                          ? "bg-pink-500 font-semibold"
                          : "hover:bg-pink-500"
                      }`
                    }
                  >
                    <FiCreditCard className="text-xl mr-2" /> Billing & Payment
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/staff"
                    className={({ isActive }) =>
                      `flex items-center px-6 py-3 rounded-r-full transition ${
                        isActive
                          ? "bg-pink-500 font-semibold"
                          : "hover:bg-pink-500"
                      }`
                    }
                  >
                    <FiUsers className="text-xl mr-2" /> Staff Management
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/inventory"
                    className={({ isActive }) =>
                      `flex items-center px-6 py-3 rounded-r-full transition ${
                        isActive
                          ? "bg-pink-500 font-semibold"
                          : "hover:bg-pink-500"
                      }`
                    }
                  >
                    <FiPackage className="text-xl mr-2" /> Inventory
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/reports"
                    className={({ isActive }) =>
                      `flex items-center px-6 py-3 rounded-r-full transition ${
                        isActive
                          ? "bg-pink-500 font-semibold"
                          : "hover:bg-pink-500"
                      }`
                    }
                  >
                    <FiBarChart2 className="text-xl mr-2" /> Report
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      `flex items-center px-6 py-3 rounded-r-full transition ${
                        isActive
                          ? "bg-pink-500 font-semibold"
                          : "hover:bg-pink-500"
                      }`
                    }
                  >
                    <FiSettings className="text-xl mr-2" /> Settings
                  </NavLink>
                </li>
              </ul>
            </nav>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 px-10 py-10 text-[#2D3748] bg-pink-50 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "" : "ml-0"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

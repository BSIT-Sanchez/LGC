import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Appointment = () => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patient: "",
    doctor: "",
    date: "",
    type: "",
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [filters, setFilters] = useState({
    doctor: "All",
    dateRange: "",
    type: "All",
  });

  const API_URL = "https://clinic-backend-xi.vercel.app/api"; // adjust if needed

  // Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_URL}/appointments`);
      const data = await res.json();
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API_URL}/patients`);
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) => [...prev, data.appointment]);
        setFilteredAppointments((prev) => [...prev, data.appointment]);
        setFormData({ patient: "", doctor: "", date: "", type: "" });
        setShowModal(false);
        toast.success("Appointment added successfully!");
      } else {
        toast.error(data.msg || "Failed to add appointment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding appointment");
    }
  };

  // Open edit modal
  const handleEdit = (appt) => {
    setSelectedAppointment(appt);
    setFormData({
      patient: appt.patient?._id || "",
      doctor: appt.doctor,
      date: appt.date.split("T")[0],
      type: appt.type,
    });
    setEditModal(true);
  };

  // Update appointment
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/appointments/${selectedAppointment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === selectedAppointment._id ? data.appointment : a))
        );
        setFilteredAppointments((prev) =>
          prev.map((a) => (a._id === selectedAppointment._id ? data.appointment : a))
        );
        setEditModal(false);
        toast.success("Appointment updated successfully!");
      } else {
        toast.error(data.msg || "Failed to update appointment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating appointment");
    }
  };

  // Delete appointment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      const res = await fetch(`${API_URL}/appointments/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) => prev.filter((a) => a._id !== id));
        setFilteredAppointments((prev) => prev.filter((a) => a._id !== id));
        toast.success("Appointment deleted successfully!");
      } else {
        toast.error("Failed to delete appointment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting appointment");
    }
  };

  // --- Filter logic remains unchanged ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });

    let filtered = [...appointments];

    if (name === "doctor" || filters.doctor !== "All") {
      const doctorFilter = name === "doctor" ? value : filters.doctor;
      if (doctorFilter !== "All") filtered = filtered.filter((appt) => appt.doctor === doctorFilter);
    }

    if (name === "type" || filters.type !== "All") {
      const typeFilter = name === "type" ? value : filters.type;
      if (typeFilter !== "All") filtered = filtered.filter((appt) => appt.type === typeFilter);
    }

    if ((name === "dateRange" && value) || (filters.dateRange && !value)) {
      const range = name === "dateRange" ? value : filters.dateRange;
      if (range) {
        const [start, end] = range.split(" - ").map((d) => new Date(d));
        filtered = filtered.filter((appt) => {
          const apptDate = new Date(appt.date);
          return apptDate >= start && apptDate <= end;
        });
      }
    }

    setFilteredAppointments(filtered);
  };

  return (
    <Layout>
      <ToastContainer position="top-right" />
      <main id="mainContent" className="flex-1 min-h-screen bg-pink-50 p-6">
        <div className="flex flex-col gap-4">
          {/* Filters + Add Button */}
          <section className="bg-white rounded-xl shadow border border-pink-100 p-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                <div>
                  <label className="text-xs text-gray-500">Doctor</label>
                  <select
                    name="doctor"
                    value={filters.doctor}
                    onChange={handleFilterChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option>All</option>
                    <option>Dr. Collado</option>
                    <option>Dr. Cruz</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Date Range</label>
                  <input
                    type="text"
                    name="dateRange"
                    value={filters.dateRange}
                    onChange={handleFilterChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="YYYY-MM-DD - YYYY-MM-DD"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Appointment Type</label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option>All</option>
                    <option>Family Planning</option>
                    <option>Prenatal Checkup</option>
                    <option>Ultrasound</option>
                  </select>
                </div>
              </div>

              {/* Add Appointment Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  Add Appointment
                </button>
              </div>
            </div>
          </section>

          {/* Appointment Table */}
          <section className="bg-white rounded-xl shadow border border-pink-100 p-4">
            <h2 className="text-lg font-semibold mb-4">Appointments</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-pink-100 text-left">
                    <th className="px-4 py-2">Patient</th>
                    <th className="px-4 py-2">Doctor</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appt) => (
                    <tr key={appt._id || appt.id} className="border-t">
                      <td className="px-4 py-2">{appt.patient?.fullName}</td>
                      <td className="px-4 py-2">{appt.doctor}</td>
                      <td className="px-4 py-2">{new Date(appt.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{appt.type}</td>
                      <td className="px-4 py-2">{appt.status}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(appt)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(appt._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Add Appointment Modal */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
              <h2 className="text-lg font-semibold mb-4">Add Appointment</h2>
              <form onSubmit={handleAddAppointment} className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Patient Name</label>
                  <select
                    name="patient"
                    value={formData.patient}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Doctor</label>
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Doctor</option>
                    <option>Dr. Collado</option>
                    <option>Dr. Cruz</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Appointment Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Type</option>
                    <option>Family Planning</option>
                    <option>Prenatal Checkup</option>
                    <option>Ultrasound</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Appointment Modal */}
        {editModal && (
          <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
              <h2 className="text-lg font-semibold mb-4">Edit Appointment</h2>
              <form onSubmit={handleUpdate} className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Patient Name</label>
                  <select
                    name="patient"
                    value={formData.patient}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Doctor</label>
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Doctor</option>
                    <option>Dr. Collado</option>
                    <option>Dr. Cruz</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Appointment Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Type</option>
                    <option>Family Planning</option>
                    <option>Prenatal Checkup</option>
                    <option>Ultrasound</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button type="button" onClick={() => setEditModal(false)} className="px-4 py-2 rounded-lg border">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Appointment;

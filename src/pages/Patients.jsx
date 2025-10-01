import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";

const Patients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "Female",
    contact: "",
    service: "Prenatal Checkup",
    address: "",
    notes: "",
  });

  const API_URL = "https://clinic-backend-xi.vercel.app/api/patients"; // Your API endpoint

  // Fetch patients from API
  const fetchPatients = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setPatients([...patients, data.patient]); // Add new patient to table
        setIsModalOpen(false);
        setFormData({
          fullName: "",
          dob: "",
          gender: "Female",
          contact: "",
          service: "Prenatal Checkup",
          address: "",
          notes: "",
        });
      } else {
        alert("Failed to add patient");
      }
    } catch (err) {
      console.error("Error adding patient:", err);
    }
  };

  return (
    <Layout>
      <main id="mainContent" className="flex-1 bg-pink-50 p-6">
        <div className="max-w-[1200px]">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h1 className="text-2xl font-bold text-pink-800">Patients Records</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-pink-600 hover:bg-pink-700 text-white rounded-lg px-4 py-2 text-sm"
              >
                <i className="bx bx-user-plus mr-1"></i> New Patient
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border rounded-xl shadow mt-4 overflow-hidden">
            <div className="px-4 py-3 border-b bg-pink-100">
              <p className="text-pink-700 font-semibold">All Patients</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-pink-50">
                  <tr>
                    <th className="text-left px-4 py-3">Patient ID</th>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">DOB</th>
                    <th className="text-left px-4 py-3">Gender</th>
                    <th className="text-left px-4 py-3">Contact</th>
                    <th className="text-left px-4 py-3">Service</th>
                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p._id} className="border-t">
                      <td className="px-4 py-3">{p.patientId}</td>
                      <td className="px-4 py-3 font-medium text-pink-700">{p.fullName}</td>
                      <td className="px-4 py-3">{new Date(p.dob).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{p.gender}</td>
                      <td className="px-4 py-3">{p.contact}</td>
                      <td className="px-4 py-3">{p.service}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            p.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* New Patient Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-black/30" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-pink-700">Add New Patient</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <i className="bx bx-x text-2xl"></i>
                </button>
              </div>
              <form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-600">Full Name</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Contact</label>
                  <input
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="09xx xxx xxxx"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Service</label>
                  <select name="service" value={formData.service} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                    <option>Prenatal Checkup</option>
                    <option>Family Planning</option>
                    <option>Ultrasound</option>
                    <option>Immunization</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-600">Address</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Complete address"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-600">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Optional notes..."
                  ></textarea>
                </div>
                <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded border">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700">
                    Save
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

export default Patients;

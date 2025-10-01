import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";

const Staff = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    department: "",
    phone: "",
  });
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const API_URL = "http://localhost:5000/api/staff";

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [staffList, searchTerm, filterRole, filterStatus]);

  const fetchStaff = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) setStaffList(data.staff);
    } catch (err) {
      console.error(err);
    }
  };

  const applyFilters = () => {
    let temp = [...staffList];

    // Search by name
    if (searchTerm.trim() !== "") {
      temp = temp.filter((staff) =>
        staff.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (filterRole !== "All") {
      temp = temp.filter((staff) => staff.role === filterRole);
    }

    // Filter by status
    if (filterStatus !== "All") {
      temp = temp.filter((staff) => staff.status === filterStatus);
    }

    setFilteredStaff(temp);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStaffId(null);
    setFormData({ fullName: "", role: "", department: "", phone: "" });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    try {
      const method = editingStaffId ? "PUT" : "POST";
      const url = editingStaffId ? `${API_URL}/${editingStaffId}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        fetchStaff();
        closeModal();
      } else {
        alert(data.msg || "Failed to save staff");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditStaff = (staff) => {
    setEditingStaffId(staff._id);
    setFormData({
      fullName: staff.fullName,
      role: staff.role,
      department: staff.department,
      phone: staff.phone,
    });
    openModal();
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this staff?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setStaffList((prev) => prev.filter((staff) => staff._id !== id));
      } else {
        alert(data.msg || "Failed to delete staff");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <main className="flex-1 min-h-screen bg-pink-50 md:ml-4 p-6">
        {/* Search + Filters + Add Staff */}
        <section className="bg-white rounded-xl shadow border border-pink-100 p-4 mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="text-xs text-gray-500">Search by Name</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search staff..."
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <div>
              <label className="text-xs text-gray-500">Role</label>
              <select
                className="border rounded-lg px-3 py-2"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option>All</option>
                <option>Midwife</option>
                <option>Physician</option>
                <option>Reception</option>
              </select>
            </div>
           
            <button
              onClick={openModal}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 mt-6 md:mt-0"
            >
              <FaUserPlus /> Add Staff Account
            </button>
          </div>
        </section>

        {/* Staff Table */}
        <section className="bg-white rounded-xl shadow border border-pink-100 overflow-hidden">
          <div className="px-6 py-3 border-b bg-pink-100">
            <h2 className="font-semibold text-pink-700">Staff</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-pink-50">
                <tr>
                  <th className="text-left px-6 py-3">Name</th>
                  <th className="text-left px-6 py-3">Role</th>
                  <th className="text-left px-6 py-3">Department</th>
                  <th className="text-left px-6 py-3">Phone</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length === 0 ? (
                  <tr className="border-t">
                    <td colSpan={6} className="text-center px-6 py-3 text-gray-400">
                      No staff found
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff) => (
                    <tr key={staff._id} className="border-t">
                      <td className="px-6 py-3">{staff.fullName}</td>
                      <td className="px-6 py-3">{staff.role}</td>
                      <td className="px-6 py-3">{staff.department}</td>
                      <td className="px-6 py-3">{staff.phone}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            staff.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {staff.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 flex gap-2">
                        <button
                          onClick={() => handleEditStaff(staff)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit Staff"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staff._id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete Staff"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Add/Edit Staff Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
            <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
              <h3 className="text-lg font-semibold mb-4">
                {editingStaffId ? "Edit Staff Account" : "Add Staff Account"}
              </h3>
              <form className="space-y-4" onSubmit={handleSaveStaff}>
                <div>
                  <label className="text-xs text-gray-500">Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select Role</option>
                    <option>Midwife</option>
                    <option>Physician</option>
                    <option>Reception</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Enter department"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-lg border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700"
                  >
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

export default Staff;

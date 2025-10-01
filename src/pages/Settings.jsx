import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaLock,FaEdit, FaTrash } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Layout from "../layout/Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Settings = () => {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add user
  const handleAddUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("User registered successfully");
        fetchUsers();
        setForm({ id: null, name: "", email: "", phone: "", password: "" });
        setIsModalOpen(false);
      } else {
        toast.error(data.msg || "Error registering user");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Something went wrong");
    }
  };

  // ✅ Edit user
  const handleEditUser = (user) => {
    setForm({
      id: user._id,
      name: user.username,
      email: user.email,
      phone: user.phone || "",
      password: "",
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  // ✅ Update user
  const handleUpdateUser = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.name,
          email: form.email,
          phone: form.phone,
          ...(form.password && { password: form.password }),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("User updated successfully");
        fetchUsers();
        setForm({ id: null, name: "", email: "", phone: "", password: "" });
        setIsModalOpen(false);
        setIsEdit(false);
      } else {
        toast.error(data.msg || "Error updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Something went wrong");
    }
  };

  // ✅ Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error(data.msg || "Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <main
        id="mainContent"
        className="flex-1 min-h-screen bg-pink-50 md:ml-4 p-6"
      >
        <h1 className="text-2xl font-extrabold text-gray-800 mb-4">
          Settings - User Management
        </h1>

        {/* Create button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setIsEdit(false);
              setForm({ id: null, name: "", email: "", phone: "", password: "" });
            }}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg"
          >
            Create User
          </button>
        </div>

        {/* Users table */}
        <section className="bg-white rounded-xl shadow border border-pink-100 overflow-hidden">
          <div className="px-6 py-3 border-b bg-pink-100">
            <h2 className="font-semibold text-pink-700">User Accounts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-pink-50">
                <tr>
                  <th className="text-left px-6 py-3">Name</th>
                  <th className="text-left px-6 py-3">Email</th>
                  <th className="text-left px-6 py-3">Phone</th>
                  <th className="text-left px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-6 py-3">{user.username}</td>
                    <td className="px-6 py-3">{user.email}</td>
                    <td className="px-6 py-3">{user.phone || "-"}</td>
                    <td className="px-6 py-3 flex gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
              <h2 className="text-lg font-semibold text-pink-700 mb-4">
                {isEdit ? "Edit User" : "Create User"}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <FaUser className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full outline-none"
                  />
                </div>
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <FaEnvelope className="text-gray-400 mr-2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full outline-none"
                  />
                </div>
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <FaPhone className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full outline-none"
                  />
                </div>
                {/* Password field */}
                <div className="flex items-center border rounded-lg px-3 py-2 relative">
                  <FaLock className="text-gray-400 mr-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={isEdit ? "New Password (optional)" : "Password"}
                    value={form.password}
                    onChange={handleChange}
                    className="w-full outline-none pr-8"
                  />
                  <button
                    type="button"
                    className="absolute right-3 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>
                <button
                  onClick={isEdit ? handleUpdateUser : handleAddUser}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg"
                >
                  {isEdit ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ✅ Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
};

export default Settings;

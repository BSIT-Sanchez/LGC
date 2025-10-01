import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../layout/Layout";
import { FaEye, FaEdit, FaTrash, FaBoxes, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

const Inventory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({ name: "", category: "Medicines", stock: 0 });
  const [categoryFilter, setCategoryFilter] = useState("All");

  const API_URL = "http://localhost:5000/api/inventory";

  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items by category
  useEffect(() => {
    if (categoryFilter === "All") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.category === categoryFilter));
    }
  }, [categoryFilter, items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "stock" ? Number(value) : value });
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (item) => {
    setSelectedItem(item);
    setForm({ name: item.name, category: item.category, stock: item.stock });
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedItem(null);
    setIsEditModalOpen(false);
  };

  // Add item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, form);
      setItems([res.data, ...items]);
      setForm({ name: "", category: "Medicines", stock: 0 });
      closeModal();
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  // Update item
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/${selectedItem._id}`, form);
      setItems(items.map((i) => (i._id === selectedItem._id ? res.data : i)));
      closeEditModal();
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  // View item
  const handleView = (item) => {
    alert(`Item: ${item.name}\nCategory: ${item.category}\nStock: ${item.stock}\nStatus: ${item.status}`);
  };

  // Export filtered items as CSV
  const handleExport = () => {
    const csvHeader = ["Name,Category,Stock,Status"];
    const csvRows = filteredItems.map((i) => `${i.name},${i.category},${i.stock},${i.status}`);
    const csvData = [...csvHeader, ...csvRows].join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <main className="flex-1 min-h-screen bg-pink-50 md:ml-4 p-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow border border-pink-100 p-5 flex items-center gap-3">
            <FaBoxes className="text-pink-500 text-2xl" />
            <div>
              <p className="text-xs text-gray-500">Total Items</p>
              <div className="text-2xl font-bold">{items.length}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow border border-pink-100 p-5 flex items-center gap-3">
            <FaExclamationTriangle className="text-yellow-500 text-2xl" />
            <div>
              <p className="text-xs text-gray-500">Low Stock</p>
              <div className="text-2xl font-bold">{items.filter((i) => i.status === "Low Stock").length}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow border border-pink-100 p-5 flex items-center gap-3">
            <FaTimesCircle className="text-red-500 text-2xl" />
            <div>
              <p className="text-xs text-gray-500">Out of Stock</p>
              <div className="text-2xl font-bold">{items.filter((i) => i.status === "Out of Stock").length}</div>
            </div>
          </div>
        </div>

        {/* Filter + Add */}
        <section className="bg-white rounded-xl shadow border border-pink-100 p-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-gray-500">Category</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={categoryFilter}
                onChange={handleCategoryFilterChange}
              >
                <option>All</option>
                <option>Medicines</option>
                      <option>Supplies</option>
                      <option>Equipment</option>
                      <option>Consumables</option>
                      <option>Accessories</option>
                
              </select>
            </div>
            <div className="md:col-span-3 flex items-end justify-end gap-2">
              <button onClick={handleExport} className="px-3 py-2 rounded bg-white border">
                Export
              </button>
              <button onClick={openModal} className="px-3 py-2 rounded bg-pink-600 text-white">
                Add Item
              </button>
            </div>
          </div>
        </section>

        {/* Inventory Table */}
        <section className="bg-white rounded-xl shadow border border-pink-100 overflow-hidden mt-4">
          <div className="px-6 py-3 border-b bg-pink-100">
            <h2 className="font-semibold text-pink-700">Inventory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-pink-50">
                <tr>
                  <th className="text-left px-6 py-3">Item name</th>
                  <th className="text-left px-6 py-3">Category</th>
                  <th className="text-left px-6 py-3">Stock</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="px-6 py-3">{item.name}</td>
                    <td className="px-6 py-3">{item.category}</td>
                    <td className="px-6 py-3">{item.stock}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          item.status === "In Stock"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 flex gap-2">
                      <button onClick={() => handleView(item)} className="text-blue-600 hover:underline">
                        <FaEye />
                      </button>
                      <button onClick={() => openEditModal(item)} className="text-yellow-600 hover:underline">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:underline">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

         {/* Add Item Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 bg-opacity-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
              <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                &times;
              </button>
              <h3 className="text-lg font-semibold mb-4">Add Inventory Item</h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-xs text-gray-500">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Enter item name"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                     <option>Medicines</option>
                      <option>Supplies</option>
                      <option>Equipment</option>
                      <option>Consumables</option>
                      <option>Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Enter stock quantity"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Item Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 bg-opacity-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
              <button onClick={closeEditModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">&times;</button>
              <h3 className="text-lg font-semibold mb-4">Edit Inventory Item</h3>
              <form className="space-y-4" onSubmit={handleUpdate}>
                <div>
                  <label className="text-xs text-gray-500">Item Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                     <option>Medicines</option>
                      <option>Supplies</option>
                      <option>Equipment</option>
                      <option>Consumables</option>
                      <option>Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Stock</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={closeEditModal} className="px-4 py-2 rounded-lg border">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700">Update</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Inventory;

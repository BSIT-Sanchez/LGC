import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../layout/Layout";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

const serviceAmounts = {
  "Prenatal Checkup": 5000,
  "Family Planning": 15000,
  Ultrasound: 3000,
  Immunization: 1000,
};

const Billing = () => {
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [billings, setBillings] = useState([]);
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [form, setForm] = useState({
    patientId: "",
    service: "",
    amount: 0,
    status: "Unpaid",
  });

  const API_URL = "https://clinic-backend-xi.vercel.app/api/billing";
  const PATIENT_URL = "https://clinic-backend-xi.vercel.app/api/patients";

  useEffect(() => {
    fetchPatients();
    fetchBillings();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(PATIENT_URL);
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBillings = async () => {
    try {
      const res = await axios.get(API_URL);
      setBillings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "patientId") {
      const selectedPatient = patients.find((p) => p._id === value);
      const service = selectedPatient ? selectedPatient.service : "";
      const amount = serviceAmounts[service] || 0;

      setForm((prev) => ({
        ...prev,
        patientId: value,
        service,
        amount,
      }));
    } else if (name === "service") {
      setForm((prev) => ({
        ...prev,
        service: value,
        amount: serviceAmounts[value] || 0,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedBilling) {
        const res = await axios.put(`${API_URL}/${selectedBilling._id}`, form);
        setBillings(
          billings.map((b) => (b._id === selectedBilling._id ? res.data : b))
        );
      } else {
        const res = await axios.post(API_URL, form);
        setBillings([res.data, ...billings]);
      }

      setForm({ patientId: "", service: "", amount: 0, status: "Unpaid" });
      setSelectedBilling(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setBillings(billings.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (billing) => {
    setSelectedBilling(billing);
    setForm({
      patientId: billing.patient._id,
      service: billing.service,
      amount: billing.amount,
      status: billing.status,
    });
    setShowModal(true);
  };

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "text-green-700 text-bold";
      case "Partial":
        return "text-yellow-700 text-bold";
      case "Unpaid":
        return "text-red-700 text-bold";
      default:
        return "";
    }
  };

  return (
    <Layout>
      <main className="flex-1 min-h-screen bg-pink-50 md:ml-4 p-6">
        {/* Invoice Table */}
        <section className="bg-white rounded-xl shadow border border-pink-100 overflow-hidden">
          <div className="px-6 py-3 border-b bg-pink-100 flex items-center justify-between">
            <h2 className="font-semibold text-pink-700">Invoices</h2>
            <button
              onClick={() => {
                setShowModal(true);
                setSelectedBilling(null);
                setForm({ patientId: "", service: "", amount: 0, status: "Unpaid" });
              }}
              className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-lg text-sm"
            >
              Create Invoice
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-pink-50">
                <tr>
                  <th className="text-left px-6 py-3">Invoice #</th>
                  <th className="text-left px-6 py-3">Patient</th>
                  <th className="text-left px-6 py-3">Service</th>
                  <th className="text-left px-6 py-3">Amount</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {billings.map((b) => (
                  <tr key={b._id} className="border-t">
                    <td className="px-6 py-3">{b.invoiceNumber}</td>
                    <td className="px-6 py-3">{b.patient.fullName}</td>
                    <td className="px-6 py-3">{b.service}</td>
                    <td className="px-6 py-3">₱{b.amount.toLocaleString()}</td>
                    <td className={`px-6 py-1 rounded-full text-center ${getStatusColor(b.status)}`}>
                      {b.status}
                    </td>
                    <td className="px-6 py-3 flex gap-2 text-xl">
                      <AiFillEdit
                        className="text-green-600 cursor-pointer"
                        onClick={() => handleEdit(b)}
                      />
                      <AiFillDelete
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDelete(b._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Create / Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedBilling(null);
                }}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
              <h3 className="text-lg font-semibold text-pink-700 mb-4">
                {selectedBilling ? "Edit Invoice" : "Create Invoice"}
              </h3>
              <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm text-gray-600">Patient</label>
                  <select
                    name="patientId"
                    value={form.patientId}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                    disabled={selectedBilling}
                  >
                    <option value="">Select Patient</option>
                    {patients.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.fullName} ({p.service})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Service</label>
                  <input
                    type="text"
                    name="service"
                    value={form.service}
                    readOnly
                    className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    readOnly
                    className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option>Paid</option>
                    <option>Partial</option>
                    <option>Unpaid</option>
                  </select>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedBilling(null);
                    }}
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg">
                    {selectedBilling ? "Update Invoice" : "Save Invoice"}
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

export default Billing;

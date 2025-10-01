import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../layout/Layout";
import { FaEye, FaFileDownload, FaFileExcel } from "react-icons/fa";

const Reports = () => {
  const [dailySummary, setDailySummary] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_URL = "http://localhost:5000/api/reports";

  useEffect(() => {
    fetchReports();
  }, []);

  // Fetch all reports
  const fetchReports = async () => {
    try {
      const res = await axios.get(API_URL);
      setDailySummary(res.data.dailySummary); // Only use dailySummary
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  // View single report
  const viewReport = (date) => {
    const report = dailySummary.find((d) => d.date === date);
    setSelectedReport(report);
    setShowModal(true);
  };

  // Download single report as CSV
  const downloadReport = (report) => {
    const header = ["Date", "Patients", "Completed Apps", "Revenue"];
    const row = [
      new Date(report.date).toLocaleDateString(),
      report.patients,
      report.completedApps,
      report.revenue,
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += header.join(",") + "\n";
    csvContent += row.join(",") + "\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${report.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download all reports as Excel (CSV)
  const downloadExcel = () => {
    const header = ["Date", "Patients", "Completed Apps", "Revenue"];
    const rows = dailySummary.map((d) => [
      new Date(d.date).toLocaleDateString(),
      d.patients,
      d.completedApps,
      d.revenue,
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += header.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reports.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <main id="mainContent" className="flex-1 min-h-screen bg-pink-50 md:ml-4 p-6">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-4">LGC's Report</h1>

        {/* Daily Summary Table */}
        <section className="bg-white rounded-xl shadow border border-pink-100 p-4 mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Daily Summary</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-pink-50">
                <tr>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Patients</th>
                  <th className="text-left px-6 py-3">Completed Apps</th>
                  <th className="text-left px-6 py-3">Revenue</th>
                  <th className="text-left px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dailySummary.length === 0 && (
                  <tr className="border-t">
                    <td colSpan={5} className="text-center px-6 py-3 text-gray-400">
                      No data available
                    </td>
                  </tr>
                )}
                {dailySummary.map((d) => (
                  <tr key={d.date} className="border-t">
                    <td className="px-6 py-3">{new Date(d.date).toLocaleDateString()}</td>
                    <td className="px-6 py-3">{d.patients}</td>
                    <td className="px-6 py-3">{d.completedApps}</td>
                    <td className="px-6 py-3">₱{d.revenue.toLocaleString()}</td>
                    <td className="px-6 py-3 flex gap-2">
                      <button
                        onClick={() => viewReport(d.date)}
                        className="text-blue-500 hover:text-blue-700"
                        title="View Report"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => downloadReport(d)}
                        className="text-green-600 hover:text-green-700"
                        title="Download Report"
                      >
                        <FaFileDownload />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        

        {/* View Modal */}
        {showModal && selectedReport && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 relative">
              <h2 className="text-lg font-bold mb-4">Report Details</h2>
              <p>
                <strong>Date:</strong> {new Date(selectedReport.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Patients:</strong> {selectedReport.patients}
              </p>
              <p>
                <strong>Completed Apps:</strong> {selectedReport.completedApps}
              </p>
              <p>
                <strong>Revenue:</strong> ₱{selectedReport.revenue.toLocaleString()}
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Reports;

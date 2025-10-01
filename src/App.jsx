import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard"; 
import Patients from "./pages/Patients";
import Appointment from "./pages/Appointment";
import Billing from "./pages/Billing";
import Staff from "./pages/Staff";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

const App = () => {
  return (
    <Routes>
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Patients" element={<Patients />} />
      <Route path="/Appointments" element={<Appointment />} />
      <Route path="/Billing" element={<Billing />} />
      <Route path="/Staff" element={<Staff />} />
      <Route path="/Inventory" element={<Inventory />} />
      <Route path="/Reports" element={<Reports />} />
      <Route path="/Settings" element={<Settings />} />
       <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default App;

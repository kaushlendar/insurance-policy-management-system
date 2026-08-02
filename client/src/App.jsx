import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Policies from "./pages/Policies";
import Premiums from "./pages/Premiums";
import Claims from "./pages/Claims";
import Documents from "./pages/Documents";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Register */}
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Customers */}
        <Route path="/customers" element={<Customers />} />

        {/* Policies */}
        <Route path="/policies" element={<Policies />} />

        {/* Premiums */}
        <Route path="/premiums" element={<Premiums />} />

        {/* Claims */}
        <Route path="/claims" element={<Claims />} />

        {/* Documents */}
        <Route path="/documents" element={<Documents />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
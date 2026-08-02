import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logout Successfully");

    navigate("/login");
  };

  return (
    <div
      className="bg-dark text-white d-flex flex-column shadow"
      style={{
        width: "250px",
        minHeight: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <div className="p-4 text-center border-bottom">
        <h3 className="fw-bold text-info">
          Insurance System
        </h3>
      </div>

      <div className="flex-grow-1 p-3">

        <Link
          to="/dashboard"
          className={`nav-link text-white mb-2 rounded p-2 ${
            location.pathname === "/dashboard"
              ? "bg-primary"
              : ""
          }`}
        >
          🏠 Dashboard
        </Link>

        <Link
          to="/customers"
          className={`nav-link text-white mb-2 rounded p-2 ${
            location.pathname === "/customers"
              ? "bg-primary"
              : ""
          }`}
        >
          👥 Customers
        </Link>

        <Link
          to="/policies"
          className={`nav-link text-white mb-2 rounded p-2 ${
            location.pathname === "/policies"
              ? "bg-primary"
              : ""
          }`}
        >
          📄 Policies
        </Link>

        <Link
          to="/premiums"
          className={`nav-link text-white mb-2 rounded p-2 ${
            location.pathname === "/premiums"
              ? "bg-primary"
              : ""
          }`}
        >
          💰 Premiums
        </Link>

        <Link
          to="/claims"
          className={`nav-link text-white mb-2 rounded p-2 ${
            location.pathname === "/claims"
              ? "bg-primary"
              : ""
          }`}
        >
          📋 Claims
        </Link>

        <Link
          to="/documents"
          className={`nav-link text-white mb-2 rounded p-2 ${
            location.pathname === "/documents"
              ? "bg-primary"
              : ""
          }`}
        >
          📁 Documents
        </Link>

      </div>

      <div className="p-3 border-top">

        <button
          className="btn btn-danger w-100"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </div>

      <div className="text-center text-secondary small py-3">
        © 2026 Insurance System
      </div>
    </div>
  );
};

export default Sidebar;
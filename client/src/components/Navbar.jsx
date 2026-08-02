import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logout Successfully");

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top px-4">

      <div className="container-fluid">

        <h3 className="fw-bold text-primary mb-0">
          Insurance Policy Management System
        </h3>

        <div className="d-flex align-items-center ms-auto">

          <span className="me-4 text-secondary fw-semibold">
            📅 {today}
          </span>

          <button
            className="btn btn-light me-3"
            title="Notifications"
          >
            🔔
          </button>

          <span className="fw-bold me-3">
            👤 Admin
          </span>

          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;
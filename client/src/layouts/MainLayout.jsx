import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="d-flex bg-light min-vh-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          marginLeft: "250px",
          width: "100%",
        }}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div
          style={{
            padding: "20px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
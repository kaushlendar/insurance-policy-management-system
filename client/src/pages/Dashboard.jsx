import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import Card from "../components/Card";
import DashboardChart from "../components/DashboardChart";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalCustomers: 0,
    totalPolicies: 0,
    totalPremiums: 0,
    totalClaims: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ===========================
  // Fetch Dashboard
  // ===========================
  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/dashboard"
      );

      setDashboard(res.data.dashboard);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <div className="container-fluid mt-4">

        <h2 className="text-center text-primary mb-4">
          Dashboard
        </h2>

        <div className="row g-4">

          <div className="col-lg-3 col-md-6">
            <Card
              title="Total Customers"
              value={dashboard.totalCustomers}
            />
          </div>

          <div className="col-lg-3 col-md-6">
            <Card
              title="Total Policies"
              value={dashboard.totalPolicies}
            />
          </div>

          <div className="col-lg-3 col-md-6">
            <Card
              title="Total Premiums"
              value={dashboard.totalPremiums}
            />
          </div>

          <div className="col-lg-3 col-md-6">
            <Card
              title="Total Claims"
              value={dashboard.totalClaims}
            />
          </div>

        </div>

        <div className="card shadow mt-5">
          <div className="card-header bg-primary text-white">
            Dashboard Analytics
          </div>

          <div className="card-body">
            <DashboardChart dashboard={dashboard} />
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default Dashboard;
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardChart = ({ dashboard }) => {
  const data = {
    labels: [
      "Customers",
      "Policies",
      "Premiums",
      "Claims",
    ],
    datasets: [
      {
        label: "Insurance Statistics",
        data: [
          dashboard.totalCustomers,
          dashboard.totalPolicies,
          dashboard.totalPremiums,
          dashboard.totalClaims,
        ],
        backgroundColor: [
          "#0d6efd",
          "#198754",
          "#ffc107",
          "#dc3545",
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Insurance Dashboard Statistics",
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="card shadow mt-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Dashboard Chart</h5>
      </div>

      <div
        className="card-body"
        style={{ height: "400px" }}
      >
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default DashboardChart;
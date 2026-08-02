import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";

const Premiums = () => {
  const [premiums, setPremiums] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const [form, setForm] = useState({
    customer_id: "",
    policy_id: "",
    amount: "",
    payment_date: "",
    status: "Pending",
  });

  useEffect(() => {
    fetchPremiums();
    fetchCustomers();
    fetchPolicies();
  }, []);

  // ===========================
  // Fetch Premiums
  // ===========================
const fetchPremiums = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/premiums"
    );

    setPremiums(res.data.premiums);
    setCurrentPage(1);
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch premiums");
  }
};

  // ===========================
  // Fetch Customers
  // ===========================
  const fetchCustomers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/customers"
      );

      setCustomers(res.data.customers);
    } catch (error) {
      console.error(error);
    }
  };

  // ===========================
  // Fetch Policies
  // ===========================
  const fetchPolicies = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/policies"
      );

      setPolicies(res.data.policies);
    } catch (error) {
      console.error(error);
    }
  };

  // ===========================
  // Handle Input
  // ===========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ===========================
  // Add / Update Premium
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editId) {
      const res = await axios.put(
        `http://localhost:5000/api/premiums/${editId}`,
        form
      );

      toast.success(res.data.message);
    } else {
      const res = await axios.post(
        "http://localhost:5000/api/premiums",
        form
      );

      toast.success(res.data.message);
    }

    setForm({
      customer_id: "",
      policy_id: "",
      amount: "",
      payment_date: "",
      status: "Pending",
    });

    setEditId(null);

    fetchPremiums();
  } catch (error) {
    toast.error(error.response?.data?.message || "Operation Failed");
  }
};

  // ===========================
  // Edit Premium
  // ===========================
  const handleEdit = (premium) => {
    setEditId(premium.id);

    setForm({
      customer_id: premium.customer_id,
      policy_id: premium.policy_id,
      amount: premium.amount,
      payment_date: premium.payment_date?.split("T")[0],
      status: premium.status,
    });
  };

  // ===========================
  // Delete Premium
  // ===========================
const deletePremium = async (id) => {
  if (!window.confirm("Delete this premium?")) return;

  try {
    const res = await axios.delete(
      `http://localhost:5000/api/premiums/${id}`
    );

    toast.success(res.data.message);

    fetchPremiums();
  } catch (error) {
    toast.error(error.response?.data?.message || "Delete Failed");
  }
};
    // ===========================
  // Search Filter
  // ===========================
  const filteredPremiums = premiums.filter(
    (premium) =>
      premium.customer_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      premium.policy_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(premium.amount).includes(search) ||
      premium.status
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // ===========================
  // Pagination
  // ===========================
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

  const currentPremiums = filteredPremiums.slice(
    firstIndex,
    lastIndex
  );

  const totalPages = Math.ceil(
    filteredPremiums.length / recordsPerPage
  );

 return (
  <div className="container mt-4">
    <h2 className="text-center mb-4">Premium Management</h2>

    <input
      type="text"
      className="form-control mb-4"
      placeholder="Search Premium..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
    />

    <form onSubmit={handleSubmit} className="row g-3 mb-4">
      <div className="col-md-4">
        <select
          className="form-select"
          name="customer_id"
          value={form.customer_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Customer</option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          name="policy_id"
          value={form.policy_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Policy</option>

          {policies.map((policy) => (
            <option key={policy.id} value={policy.id}>
              {policy.policy_name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <input
          type="number"
          className="form-control"
          name="amount"
          placeholder="Premium Amount"
          value={form.amount}
          onChange={handleChange}
          required
          min="1"
        />
      </div>

      <div className="col-md-4">
        <input
          type="date"
          className="form-control"
          name="payment_date"
          value={form.payment_date}
          onChange={handleChange}
          required
          max={new Date().toISOString().split("T")[0]}
        />
              </div>

      <div className="col-md-4">
        <select
          className="form-select"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      <div className="col-md-4 d-flex align-items-end">
        <button className="btn btn-primary me-2" type="submit">
          {editId ? "Update Premium" : "Add Premium"}
        </button>

        {editId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setEditId(null);

              setForm({
                customer_id: "",
                policy_id: "",
                amount: "",
                payment_date: "",
                status: "Pending",
              });
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>

    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Policy</th>
            <th>Amount</th>
            <th>Payment Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentPremiums.length > 0 ? (
            currentPremiums.map((premium) => (
              <tr key={premium.id}>
                <td>{premium.id}</td>
                <td>{premium.customer_name}</td>
                <td>{premium.policy_name}</td>
                <td>₹ {premium.amount}</td>
                <td>{premium.payment_date?.split("T")[0]}</td>

                <td>
                  <span
                    className={
                      premium.status === "Paid"
                        ? "badge bg-success"
                        : "badge bg-warning text-dark"
                    }
                  >
                    {premium.status}
                  </span>
                </td>

                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleEdit(premium)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deletePremium(premium.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No Premiums Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <div className="d-flex justify-content-center align-items-center mt-3">
      <button
        className="btn btn-secondary me-3"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        Previous
      </button>

      <strong>
        Page {currentPage} of {totalPages || 1}
      </strong>

      <button
        className="btn btn-secondary ms-3"
        disabled={
          currentPage === totalPages || totalPages === 0
        }
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Next
      </button>
    </div>
  </div>
);
};

export default Premiums;
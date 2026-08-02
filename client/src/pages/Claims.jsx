import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Claims = () => {
  const [claims, setClaims] = useState([]);
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
    claim_amount: "",
    claim_date: "",
    status: "Pending",
    description: "",
  });

  useEffect(() => {
    fetchClaims();
    fetchCustomers();
    fetchPolicies();
  }, []);

  // ===========================
  // Fetch Claims
  // ===========================
  const fetchClaims = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/claims"
      );

      setClaims(res.data.claims);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch claims");
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
      toast.error("Failed to fetch customers");
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
      toast.error("Failed to fetch policies");
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
// Add / Update Claim
// ===========================
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.customer_id) {
    return toast.error("Please select customer");
  }

  if (!form.policy_id) {
    return toast.error("Please select policy");
  }

  if (
    !form.claim_amount ||
    Number(form.claim_amount) < 100
  ) {
    return toast.error(
      "Claim amount must be at least ₹100"
    );
  }

  if (!form.claim_date) {
    return toast.error("Please select claim date");
  }

  if (form.description.trim().length < 10) {
    return toast.error(
      "Description must be at least 10 characters"
    );
  }

  try {
    if (editId) {
      const res = await axios.put(
        `http://localhost:5000/api/claims/${editId}`,
        form
      );

      toast.success(res.data.message);
    } else {
      const res = await axios.post(
        "http://localhost:5000/api/claims",
        form
      );

      toast.success(res.data.message);
    }

    setForm({
      customer_id: "",
      policy_id: "",
      claim_amount: "",
      claim_date: "",
      status: "Pending",
      description: "",
    });

    setEditId(null);

    fetchClaims();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Operation Failed"
    );
  }
};

// ===========================
// Edit Claim
// ===========================
const handleEdit = (claim) => {
  setEditId(claim.id);

  setForm({
    customer_id: claim.customer_id,
    policy_id: claim.policy_id,
    claim_amount: claim.claim_amount,
    claim_date: claim.claim_date?.split("T")[0],
    status: claim.status,
    description: claim.description,
  });
};

// ===========================
// Delete Claim
// ===========================
const deleteClaim = async (id) => {
  if (!window.confirm("Delete this claim?")) return;

  try {
    const res = await axios.delete(
      `http://localhost:5000/api/claims/${id}`
    );

    toast.success(res.data.message);

    fetchClaims();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Delete Failed"
    );
  }
};
// ===========================
// Search Filter
// ===========================
const filteredClaims = claims.filter(
  (claim) =>
    claim.customer_name
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    claim.policy_name
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    String(claim.claim_amount).includes(search) ||
    claim.status
      ?.toLowerCase()
      .includes(search.toLowerCase())
);

// ===========================
// Pagination
// ===========================
const totalPages = Math.ceil(
  filteredClaims.length / recordsPerPage
);

const currentClaims = filteredClaims.slice(
  (currentPage - 1) * recordsPerPage,
  currentPage * recordsPerPage
);

return (
  <div className="container mt-4">

    <h2 className="text-center mb-4">
      Claim Management
    </h2>

    <input
      type="text"
      className="form-control mb-4"
      placeholder="Search Claim..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
    />

    <form
      onSubmit={handleSubmit}
      className="row g-3 mb-4"
    >

      <div className="col-md-4">
        <select
          className="form-select"
          name="customer_id"
          value={form.customer_id}
          onChange={handleChange}
          required
        >
          <option value="">
            Select Customer
          </option>

          {customers.map((customer) => (
            <option
              key={customer.id}
              value={customer.id}
            >
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
          <option value="">
            Select Policy
          </option>

          {policies.map((policy) => (
            <option
              key={policy.id}
              value={policy.id}
            >
              {policy.policy_name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <input
          type="number"
          className="form-control"
          name="claim_amount"
          placeholder="Claim Amount"
          value={form.claim_amount}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-md-4">
        <input
          type="date"
          className="form-control"
          name="claim_date"
          value={form.claim_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Pending">
            Pending
          </option>

          <option value="Approved">
            Approved
          </option>

          <option value="Rejected">
            Rejected
          </option>
        </select>
      </div>

      <div className="col-md-12">
        <textarea
          className="form-control"
          name="description"
          rows="3"
          placeholder="Claim Description"
          value={form.description}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <div className="col-md-12">

        <button
          type="submit"
          className="btn btn-primary me-2"
        >
          {editId
            ? "Update Claim"
            : "Add Claim"}
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
                claim_amount: "",
                claim_date: "",
                status: "Pending",
                description: "",
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
            <th>Claim Amount</th>
            <th>Claim Date</th>
            <th>Status</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentClaims.length > 0 ? (
            currentClaims.map((claim) => (
              <tr key={claim.id}>
                <td>{claim.id}</td>
                <td>{claim.customer_name}</td>
                <td>{claim.policy_name}</td>
                <td>₹ {claim.claim_amount}</td>
                <td>{claim.claim_date?.split("T")[0]}</td>

                <td>
                  <span
                    className={
                      claim.status === "Approved"
                        ? "badge bg-success"
                        : claim.status === "Rejected"
                        ? "badge bg-danger"
                        : "badge bg-warning text-dark"
                    }
                  >
                    {claim.status}
                  </span>
                </td>

                <td>{claim.description}</td>

                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleEdit(claim)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      deleteClaim(claim.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                className="text-center"
              >
                No Claims Found
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
        onClick={() =>
          setCurrentPage(currentPage - 1)
        }
      >
        Previous
      </button>

      <strong>
        Page {currentPage} of {totalPages || 1}
      </strong>

      <button
        className="btn btn-secondary ms-3"
        disabled={
          currentPage === totalPages ||
          totalPages === 0
        }
        onClick={() =>
          setCurrentPage(currentPage + 1)
        }
      >
        Next
      </button>

    </div>

  </div>
);
};

export default Claims;
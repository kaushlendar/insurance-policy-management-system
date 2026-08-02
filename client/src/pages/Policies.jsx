import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const [form, setForm] = useState({
    policy_name: "",
    policy_type: "",
    premium: "",
    duration: "",
    description: "",
  });

  useEffect(() => {
    fetchPolicies();
  }, []);
  // ===========================
// Fetch Policies
// ===========================
const fetchPolicies = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/policies"
    );

    setPolicies(res.data.policies);
    setCurrentPage(1);
  } catch (error) {
    console.log(error);
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
// Add / Update Policy
// ===========================
const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.policy_name.trim().length < 3) {
    return toast.error(
      "Policy Name must be at least 3 characters"
    );
  }

  if (form.policy_type.trim().length < 3) {
    return toast.error(
      "Policy Type must be at least 3 characters"
    );
  }

  if (Number(form.premium) <= 0) {
    return toast.error(
      "Premium must be greater than 0"
    );
  }

  if (Number(form.duration) <= 0) {
    return toast.error(
      "Duration must be greater than 0"
    );
  }

  if (form.description.trim().length < 10) {
    return toast.error(
      "Description must be at least 10 characters"
    );
  }

  try {
    if (editId) {
      const res = await axios.put(
        `http://localhost:5000/api/policies/${editId}`,
        form
      );

      toast.success(res.data.message);
    } else {
      const res = await axios.post(
        "http://localhost:5000/api/policies",
        form
      );

      toast.success(res.data.message);
    }

    setForm({
      policy_name: "",
      policy_type: "",
      premium: "",
      duration: "",
      description: "",
    });

    setEditId(null);

    fetchPolicies();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Operation Failed"
    );
  }
};
// ===========================
// Edit Policy
// ===========================
const handleEdit = (policy) => {
  setEditId(policy.id);

  setForm({
    policy_name: policy.policy_name,
    policy_type: policy.policy_type,
    premium: policy.premium,
    duration: policy.duration,
    description: policy.description,
  });
};

// ===========================
// Delete Policy
// ===========================
const deletePolicy = async (id) => {
  if (!window.confirm("Delete this policy?")) return;

  try {
    const res = await axios.delete(
      `http://localhost:5000/api/policies/${id}`
    );

    toast.success(res.data.message);

    fetchPolicies();
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Delete Failed"
    );
  }
};

// ===========================
// Search Filter
// ===========================
const filteredPolicies = policies.filter(
  (policy) =>
    policy.policy_name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    policy.policy_type
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    String(policy.premium).includes(search)
);

// ===========================
// Pagination
// ===========================
const lastIndex = currentPage * recordsPerPage;
const firstIndex = lastIndex - recordsPerPage;

const currentPolicies = filteredPolicies.slice(
  firstIndex,
  lastIndex
);

const totalPages = Math.ceil(
  filteredPolicies.length / recordsPerPage
);
return (
  <div className="container mt-4">

    <h2 className="text-center mb-4">
      Policy Management
    </h2>

    <input
      type="text"
      className="form-control mb-4"
      placeholder="Search Policy..."
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
      <div className="col-md-3">
  <input
    type="text"
    className="form-control"
    name="policy_name"
    placeholder="Policy Name"
    value={form.policy_name}
    onChange={handleChange}
    required
    minLength="3"
    maxLength="50"
  />
</div>

<div className="col-md-3">
  <input
    type="text"
    className="form-control"
    name="policy_type"
    placeholder="Policy Type"
    value={form.policy_type}
    onChange={handleChange}
    required
    minLength="3"
    maxLength="30"
  />
</div>

<div className="col-md-2">
  <input
    type="number"
    className="form-control"
    name="premium"
    placeholder="Premium"
    value={form.premium}
    onChange={handleChange}
    required
    min="1"
  />
</div>

<div className="col-md-2">
  <input
    type="number"
    className="form-control"
    name="duration"
    placeholder="Duration"
    value={form.duration}
    onChange={handleChange}
    required
    min="1"
    max="100"
  />
</div>

<div className="col-md-12">
  <textarea
    className="form-control"
    name="description"
    placeholder="Policy Description"
    value={form.description}
    onChange={handleChange}
    rows="3"
    required
    minLength="10"
    maxLength="500"
  ></textarea>
</div>

<div className="col-md-2 d-grid">
  <button
    type="submit"
    className={
      editId
        ? "btn btn-warning"
        : "btn btn-primary"
    }
  >
    {editId
      ? "Update Policy"
      : "Add Policy"}
  </button>
</div>

{editId && (
  <div className="col-md-2 d-grid">
    <button
      type="button"
      className="btn btn-secondary"
      onClick={() => {
        setEditId(null);

        setForm({
          policy_name: "",
          policy_type: "",
          premium: "",
          duration: "",
          description: "",
        });
      }}
    >
      Cancel
    </button>
  </div>
)}

</form>

<div className="table-responsive">
  <table className="table table-bordered table-striped table-hover">
    <thead className="table-dark">
      <tr>
        <th>ID</th>
        <th>Policy Name</th>
        <th>Type</th>
        <th>Premium</th>
        <th>Duration</th>
        <th>Description</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {currentPolicies.length > 0 ? (
  currentPolicies.map((policy) => (
    <tr key={policy.id}>
      <td>{policy.id}</td>
      <td>{policy.policy_name}</td>
      <td>{policy.policy_type}</td>
      <td>₹ {policy.premium}</td>
      <td>{policy.duration} Years</td>
      <td>{policy.description}</td>

      <td>
        <button
          className="btn btn-success btn-sm"
          onClick={() => handleEdit(policy)}
        >
          Edit
        </button>

        <button
          className="btn btn-danger btn-sm ms-2"
          onClick={() => deletePolicy(policy.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="7" className="text-center">
      No Policies Found
    </td>
  </tr>
)}
    </tbody>
  </table>
</div>

{/* Pagination */}
<div className="d-flex justify-content-center align-items-center mt-4">

  <button
    className="btn btn-secondary"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Previous
  </button>

  <span className="mx-3 fw-bold">
    Page {currentPage} of {totalPages || 1}
  </span>

  <button
    className="btn btn-secondary"
    disabled={
      currentPage === totalPages ||
      totalPages === 0
    }
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>

</div>

</div>
);
};

export default Policies;
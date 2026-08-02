import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchCustomers();
  }, []);
  // ===========================
// Fetch Customers
// ===========================
const fetchCustomers = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/customers"
    );

    setCustomers(res.data.customers);
    setCurrentPage(1);
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch customers");
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
// Add / Update Customer
// ===========================
const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.name.trim().length < 3) {
    return toast.error(
      "Name must be at least 3 characters"
    );
  }

  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(form.email)) {
    return toast.error("Enter a valid email");
  }

  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(form.phone)) {
    return toast.error(
      "Phone number must be 10 digits"
    );
  }

  if (!editId && form.password.length < 6) {
    return toast.error(
      "Password must be at least 6 characters"
    );
  }

  try {
    if (editId) {
      const res = await axios.put(
        `http://localhost:5000/api/customers/${editId}`,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
        }
      );

      toast.success(res.data.message);
    } else {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      toast.success(res.data.message);
    }

    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
    });

    setEditId(null);

    fetchCustomers();
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Operation Failed"
    );
  }
};
// ===========================
// Edit Customer
// ===========================
const handleEdit = (customer) => {
  setEditId(customer.id);

  setForm({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    password: "",
  });
};

// ===========================
// Delete Customer
// ===========================
const deleteCustomer = async (id) => {
  if (!window.confirm("Delete this customer?")) return;

  try {
    const res = await axios.delete(
      `http://localhost:5000/api/customers/${id}`
    );

    toast.success(res.data.message);

    fetchCustomers();
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Delete Failed"
    );
  }
};

// ===========================
// Search Filter
// ===========================
const filteredCustomers = customers.filter(
  (customer) =>
    customer.name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    customer.email
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    customer.phone.includes(search)
);

// ===========================
// Pagination
// ===========================
const lastIndex = currentPage * recordsPerPage;
const firstIndex = lastIndex - recordsPerPage;

const currentCustomers = filteredCustomers.slice(
  firstIndex,
  lastIndex
);

const totalPages = Math.ceil(
  filteredCustomers.length / recordsPerPage
);
return (
  <div className="container mt-4">

    <h2 className="text-center mb-4">
      Customer Management
    </h2>

    <input
      type="text"
      className="form-control mb-4"
      placeholder="Search Customer..."
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
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          minLength="3"
          maxLength="50"
        />
      </div>

      <div className="col-md-3">
        <input
          type="email"
          className="form-control"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-md-2">
        <input
          type="text"
          className="form-control"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
          maxLength="10"
          pattern="[0-9]{10}"
        />
      </div>

      {!editId && (
        <div className="col-md-2">
          <input
            type="password"
            className="form-control"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>
      )}

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
            ? "Update Customer"
            : "Add Customer"}
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
                name: "",
                email: "",
                phone: "",
                password: "",
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
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
                    {currentCustomers.length > 0 ? (
            currentCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>

                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleEdit(customer)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() =>
                      deleteCustomer(customer.id)
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
                colSpan="5"
                className="text-center"
              >
                No Customers Found
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
        onClick={() =>
          setCurrentPage(currentPage - 1)
        }
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

export default Customers;
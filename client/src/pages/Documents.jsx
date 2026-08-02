import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 5;

  const [form, setForm] = useState({
    customer_id: "",
    policy_id: "",
    document_name: "",
    document: null,
  });

  useEffect(() => {
    fetchDocuments();
    fetchCustomers();
    fetchPolicies();
  }, []);
  // ===========================
// Fetch Documents
// ===========================
const fetchDocuments = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/documents"
    );

    setDocuments(res.data.documents);
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch documents");
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
// Handle File
// ===========================
const handleFileChange = (e) => {
  setForm({
    ...form,
    document: e.target.files[0],
  });
};
// ===========================
// Upload Document
// ===========================
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();

  data.append("customer_id", form.customer_id);
  data.append("policy_id", form.policy_id);
  data.append("document_name", form.document_name);
  data.append("document", form.document);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/documents",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success(res.data.message);

    setForm({
      customer_id: "",
      policy_id: "",
      document_name: "",
      document: null,
    });

    fetchDocuments();
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Upload Failed"
    );
  }
};

// ===========================
// Delete Document
// ===========================
const deleteDocument = async (id) => {
  if (!window.confirm("Delete this document?")) return;

  try {
    const res = await axios.delete(
      `http://localhost:5000/api/documents/${id}`
    );

    toast.success(res.data.message);

    fetchDocuments();
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Delete Failed"
    );
  }
};

// ===========================
// Search
// ===========================
const filteredDocuments = documents.filter(
  (doc) =>
    doc.customer_name
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    doc.policy_name
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    doc.document_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
);

// ===========================
// Pagination
// ===========================
const indexOfLastDocument =
  currentPage * documentsPerPage;

const indexOfFirstDocument =
  indexOfLastDocument - documentsPerPage;

const currentDocuments = filteredDocuments.slice(
  indexOfFirstDocument,
  indexOfLastDocument
);

const totalPages = Math.ceil(
  filteredDocuments.length / documentsPerPage
);
return (
  <div className="container mt-4">
    <h2 className="text-center mb-4">
      Document Management
    </h2>

    <input
      type="text"
      className="form-control mb-4"
      placeholder="Search Document..."
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
          <option value="">Select Customer</option>

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
          <option value="">Select Policy</option>

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
          type="text"
          className="form-control"
          name="document_name"
          placeholder="Document Name"
          value={form.document_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-md-6">
        <input
          type="file"
          className="form-control"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleFileChange}
          required
        />
      </div>

      <div className="col-md-6 d-flex align-items-end">
        <button
          type="submit"
          className="btn btn-primary"
        >
          Upload Document
        </button>
      </div>
    </form>

    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Policy</th>
            <th>Document Name</th>
            <th>File</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentDocuments.length > 0 ? (
            currentDocuments.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.customer_name}</td>
                <td>{doc.policy_name}</td>
                <td>{doc.document_name}</td>

                <td>
                  <a
                    href={`http://localhost:5000/uploads/${doc.file_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-info btn-sm"
                  >
                    View
                  </a>
                </td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      deleteDocument(doc.id)
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
                colSpan="6"
                className="text-center"
              >
                No Documents Found
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

export default Documents;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddClient = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    domain: "",
    status: "Active",
    plan: "SEO Plan",
    nextReport: "",
  });

  const [loading, setLoading] = useState(false);

  /* HANDLE INPUT CHANGE */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* SUBMIT CLIENT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newClient = {
        id: Date.now().toString(),
        ...form,
      };

      const res = await fetch("http://localhost:5000/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
      });

      if (!res.ok) {
        throw new Error("Failed to add client");
      }

      alert("Client added successfully 🚀");
      navigate("/admin/clients");
    } catch (error) {
      console.error(error);
      alert("Error adding client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">

      {/* HEADER */}
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold mb-1">Add New Client</h4>
          <p className="text-muted">
            Create and onboard a new client for your agency.
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">

          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              {/* CLIENT NAME */}
              <div className="col-12 col-md-6">
                <label className="form-label">Client Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  required
                  onChange={handleChange}
                />
              </div>

              {/* WEBSITE */}
              <div className="col-12 col-md-6">
                <label className="form-label">Website Domain</label>
                <input
                  type="text"
                  className="form-control"
                  name="domain"
                  placeholder="example.com"
                  required
                  onChange={handleChange}
                />
              </div>

              {/* STATUS */}
              <div className="col-12 col-md-4">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Warning">Warning</option>
                </select>
              </div>

              {/* PLAN */}
              <div className="col-12 col-md-4">
                <label className="form-label">Plan</label>
                <select
                  className="form-select"
                  name="plan"
                  onChange={handleChange}
                >
                  <option value="SEO Plan">SEO Plan</option>
                  <option value="Premium SEO">Premium SEO</option>
                  <option value="Local SEO">Local SEO</option>
                  <option value="E-commerce SEO">E-commerce SEO</option>
                </select>
              </div>

              {/* NEXT REPORT */}
              <div className="col-12 col-md-4">
                <label className="form-label">Next Report Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="nextReport"
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-4 d-flex flex-wrap gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Adding Client..." : "Add Client"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate("/admin/clients")}
              >
                Cancel
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default AddClient;

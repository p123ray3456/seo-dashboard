import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const EditClient = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    domain: "",
    status: "Active",
    plan: "SEO Plan",
    nextReport: "",
  });

  const [loading, setLoading] = useState(true);

  /* FETCH CLIENT FROM MONGODB */
  useEffect(() => {
    fetch(`https://seo-dashboard-production-ec44.up.railway.app/clients/${clientId}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          domain: data.domain || "",
          status: data.status || "Active",
          plan: data.plan || "SEO Plan",
          nextReport: data.nextReport || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Client not found");
        navigate("/admin/clients");
      });
  }, [clientId, navigate]);

  /* HANDLE INPUT */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* UPDATE CLIENT */
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`https://seo-dashboard-production-ec44.up.railway.app/clients/${clientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Client updated successfully 🚀");
      navigate("/admin/clients");
    } catch (error) {
      console.error(error);
      alert("Error updating client");
    }
  };

  /* DELETE CLIENT */
  const deleteClient = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://seo-dashboard-production-ec44.up.railway.app/clients/${clientId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      alert("Client deleted successfully");
      navigate("/admin/clients");
    } catch (error) {
      console.error(error);
      alert("Error deleting client");
    }
  };

  if (loading) return <div className="p-4">Loading client...</div>;

  return (
    <div className="container-fluid">

      {/* HEADER */}
      <div className="mb-4">
        <h4 className="fw-bold">Edit Client</h4>
        <p className="text-muted">Update client details</p>
      </div>

      {/* FORM */}
      <div className="card shadow-sm border-0">
        <div className="card-body">

          <form onSubmit={handleSave}>
            <div className="row g-3">

              {/* NAME */}
              <div className="col-md-6">
                <label className="form-label">Client Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* DOMAIN */}
              <div className="col-md-6">
                <label className="form-label">Website</label>
                <input
                  className="form-control"
                  name="domain"
                  value={form.domain}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* STATUS */}
              <div className="col-md-4">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option>Active</option>
                  <option>Paused</option>
                  <option>Warning</option>
                </select>
              </div>

              {/* PLAN */}
              <div className="col-md-4">
                <label className="form-label">Plan</label>
                <select
                  className="form-select"
                  name="plan"
                  value={form.plan}
                  onChange={handleChange}
                >
                  <option>SEO Plan</option>
                  <option>Premium SEO</option>
                  <option>Local SEO</option>
                  <option>E-commerce SEO</option>
                </select>
              </div>

              {/* NEXT REPORT */}
              <div className="col-md-4">
                <label className="form-label">Next Report</label>
                <input
                  type="date"
                  className="form-control"
                  name="nextReport"
                  value={form.nextReport}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* BUTTONS */}
            <div className="mt-4 d-flex justify-content-between flex-wrap gap-2">

              <div>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2"
                  onClick={() => navigate("/admin/clients")}
                >
                  Cancel
                </button>
              </div>

              {/* DELETE */}
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteClient}
              >
                Delete Client
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default EditClient;

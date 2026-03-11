import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ManageClients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CLIENTS FROM MONGODB ================= */

  useEffect(() => {
    fetch("http://localhost:5000/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading clients:", err);
        setLoading(false);
      });
  }, []);

  /* ================= NAVIGATION FUNCTIONS ================= */

  const openDashboard = (clientId) => {
  localStorage.setItem("role", "client");
  localStorage.setItem("clientId", clientId);
  navigate(`/dashboard/${clientId}/overview`);
};



  const openEditPage = (clientId) => {
    navigate(`/admin/clients/edit/${clientId}`);
  };

  const openSettings = (clientId) => {
    navigate(`/admin/clients/${clientId}/settings`);
  };

  const openAddClient = () => {
    navigate("/admin/clients/add");
  };

  /* ================= UI ================= */

  if (loading) {
    return <div className="p-4">Loading clients...</div>;
  }

  return (
    <div className="container-fluid">

      {/* HEADER */}
      <div className="row mb-4 align-items-center">
        <div className="col-12 col-md-8 mb-3 mb-md-0">
          <h4 className="fw-bold mb-1">Manage Clients</h4>
          <p className="text-muted mb-0">
            View and manage your agency’s client roster.
          </p>
        </div>

        <div className="col-12 col-md-4 text-md-end">
          <button
            className="btn btn-primary w-100 w-md-auto"
            onClick={openAddClient}
          >
            + Add New Client
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">

          <div className="table-responsive">
            <table className="table align-middle mb-0">

              <thead className="table-light">
                <tr>
                  <th>Client</th>
                  <th className="d-none d-md-table-cell">Website</th>
                  <th>Status</th>
                  <th className="d-none d-lg-table-cell">Plan</th>
                  <th className="d-none d-lg-table-cell">Next Report</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4">
                      No clients found
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id}>

                      {/* CLIENT NAME */}
                      <td>
                        <div className="fw-semibold">{client.name}</div>
                        <small className="text-muted">
                          ID: #{client.id}
                        </small>

                        {/* mobile extra info */}
                        <div className="d-md-none mt-1">
                          <small className="text-muted">
                            {client.domain}
                          </small>
                        </div>
                      </td>

                      {/* WEBSITE */}
                      <td className="d-none d-md-table-cell">
                        <a
                          href={client.domain.startsWith("http") ? client.domain : `https://${client.domain}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {client.domain}
                        </a>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={`badge ${
                            client.status === "Active"
                              ? "bg-success"
                              : client.status === "Paused"
                              ? "bg-secondary"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>

                      {/* PLAN */}
                      <td className="d-none d-lg-table-cell">
                        {client.plan || "SEO Plan"}
                      </td>

                      {/* NEXT REPORT */}
                      <td className="d-none d-lg-table-cell">
                        {client.nextReport || "-"}
                      </td>

                      {/* ACTIONS */}
                      <td className="text-end">

                        <div className="d-flex gap-1 justify-content-end flex-wrap">

                          {/* OPEN DASHBOARD */}
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openDashboard(client.id)}
                          >
                            Open
                          </button>

                          {/* EDIT CLIENT */}
                          <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => openEditPage(client.id)}
                          >
                            ✏
                          </button>

                          {/* CLIENT SETTINGS */}
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => openSettings(client.id)}
                          >
                            ⚙
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageClients;

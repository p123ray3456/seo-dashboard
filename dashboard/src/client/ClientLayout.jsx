import { NavLink, Outlet, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ClientLayout = () => {

  const { clientId } = useParams();
  const storedClientId = localStorage.getItem("clientId");

  const [clientName, setClientName] = useState("SEO Dashboard");

  // 🔒 SECURITY CHECK
  if (clientId !== storedClientId) {
    return <Navigate to={`/dashboard/${storedClientId}/overview`} replace />;
  }

  /* ================= FETCH CLIENT NAME ================= */

  useEffect(() => {
    fetch(`http://localhost:5000/clients/${clientId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.name) {
          setClientName(data.name);
        }
      })
      .catch(err => console.log("Client fetch error:", err));
  }, [clientId]);

  const menu = [
    { name: "Overview", path: "overview", icon: "bi-speedometer2" },
    { name: "Search Console", path: "search-console", icon: "bi-search" },
    { name: "Keyword Performance", path: "keywords", icon: "bi-bar-chart" },
    { name: "Traffic Growth", path: "traffic", icon: "bi-graph-up" },
    { name: "Work Log", path: "work-log", icon: "bi-journal-text" },
     { name: "Leads & Conversions", path: "leads", icon: "bi-currency-dollar" },
    { name: "Monthly Summary", path: "monthly-summary", icon: "bi-calendar" },
    { name: "Next Month Plan", path: "next-month-plan", icon: "bi-lightbulb" },
    { name: "Support / Queries", path: "support", icon: "bi-chat-dots" },
    { name: "Settings", path: "settings", icon: "bi-gear" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f1f5f9" }}>

      {/* SIDEBAR */}
      <div
        style={{
          width: "260px",
          background: "#0f172a",
          color: "#fff",
          padding: "25px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >

        {/* TOP SECTION */}
        <div>

          {/* CLIENT NAME HERE */}
          <h4 className="fw-bold mb-1">{clientName} Dashboard</h4>
          <ul className="nav flex-column mt-4 gap-2">
            {menu.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={`/dashboard/${clientId}/${item.path}`}
                  className={({ isActive }) =>
                    `d-flex align-items-center gap-3 px-3 py-2 rounded ${
                      isActive ? "active-menu" : "inactive-menu"
                    }`
                  }
                  style={{
                    textDecoration: "none",
                    transition: "0.2s ease"
                  }}
                >
                  <i className={`bi ${item.icon}`}></i>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* BOTTOM SECTION */}
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "15px" }}>
          <button
            className="btn btn-outline-light w-100"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Sign Out
          </button>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          padding: "35px",
        }}
      >
        <Outlet />
      </div>

      {/* CUSTOM STYLES */}
      <style>{`

        .inactive-menu {
          color: #cbd5e1;
        }

        .inactive-menu:hover {
          background: #1e293b;
          color: #fff;
        }

        .active-menu {
          background: linear-gradient(90deg, #2563eb, #3b82f6);
          color: white;
          box-shadow: 0 4px 12px rgba(37,99,235,0.4);
        }

        .active-menu i {
          color: white;
        }

        .inactive-menu i {
          font-size: 16px;
        }
       /* MOBILE RESPONSIVE */

@media (max-width:768px){

  /* SIDEBAR */

  .sidebar{
    position:fixed;
    left:-260px;
    top:0;
    height:100%;
    z-index:999;
    transition:0.3s;
  }

  .sidebar.open{
    left:0;
  }

  /* MAIN CONTENT */

  .main-content{
    padding:20px !important;
  }

}
      `}</style>

    </div>
  );
};

export default ClientLayout;
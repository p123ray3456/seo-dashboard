import { NavLink, Outlet, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ClientLayout = () => {

  const { clientId } = useParams();
  const storedClientId = localStorage.getItem("clientId");

  const [clientName, setClientName] = useState("SEO Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ================= SECURITY CHECK ================= */

  if (clientId !== storedClientId) {
    return <Navigate to={`/dashboard/${storedClientId}/overview`} replace />;
  }

  /* ================= FETCH CLIENT NAME ================= */

  useEffect(() => {

    fetch(`https://seo-dashboard-production-ec44.up.railway.app/clients/${clientId}`)
      .then(res => res.json())
      .then(data => {
        if (data?.name) setClientName(data.name);
      })
      .catch(err => console.log(err));

  }, [clientId]);

  /* ================= MENU ================= */

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

    <div className="dashboard-container">

      {/* MOBILE HEADER */}

      <div className="mobile-header">

        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>

        <span className="fw-bold">{clientName}</span>

      </div>


      {/* SIDEBAR */}

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        <div>

          <h4 className="fw-bold text-white mb-3">
            {clientName} Dashboard
          </h4>

          <ul className="nav flex-column gap-2">

            {menu.map((item) => (

              <li key={item.path}>

                <NavLink
                  to={`/dashboard/${clientId}/${item.path}`}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `menu-item d-flex align-items-center gap-3 px-3 py-2 rounded ${
                      isActive ? "active-menu" : "inactive-menu"
                    }`
                  }
                >
                  <i className={`bi ${item.icon}`}></i>
                  {item.name}
                </NavLink>

              </li>

            ))}

          </ul>

        </div>

        {/* LOGOUT */}

        <div className="logout-section">

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

      <div className="main-content">
        <Outlet />
      </div>


      {/* ================= CSS ================= */}

      <style>{`

/* LAYOUT */

.dashboard-container{
display:flex;
height:100vh;
background:#f1f5f9;
overflow:hidden;
}

/* SIDEBAR */

.sidebar{
width:260px;
background:#0f172a;
padding:20px 18px;
display:flex;
flex-direction:column;
justify-content:space-between;
transition:0.3s;
overflow-y:auto;
}

/* MAIN CONTENT */

.main-content{
flex:1;
padding:24px;
overflow-y:auto;
height:100vh;
}

/* MENU */

.menu-item{
text-decoration:none;
font-size:15px;
transition:0.2s;
}

.inactive-menu{
color:#cbd5e1;
}

.inactive-menu:hover{
background:#1e293b;
color:white;
}

.active-menu{
background:linear-gradient(90deg,#2563eb,#3b82f6);
color:white;
box-shadow:0 4px 12px rgba(37,99,235,0.4);
}

/* LOGOUT */

.logout-section{
border-top:1px solid #1e293b;
padding-top:15px;
}

/* MOBILE HEADER */

.mobile-header{
display:none;
background:white;
padding:12px 16px;
border-bottom:1px solid #e5e7eb;
align-items:center;
gap:12px;
}

.menu-btn{
background:none;
border:none;
font-size:22px;
cursor:pointer;
}

/* TABLET */

@media (max-width:992px){

.sidebar{
width:220px;
}

.main-content{
padding:20px;
}

}

/* MOBILE */

@media (max-width:768px){

.dashboard-container{
flex-direction:column;
height:auto;
}

.mobile-header{
display:flex;
}

.sidebar{
position:fixed;
left:-260px;
top:0;
height:100%;
z-index:999;
}

.sidebar.open{
left:0;
}

.main-content{
height:auto;
padding:18px;
}

}

`}</style>

    </div>

  );
};

export default ClientLayout;
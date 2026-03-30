import { Outlet, Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const TeamLayout = () => {

  const { clientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname.includes(path);

  /* 🔥 AUTO CLOSE SIDEBAR ON ROUTE CHANGE */
  useEffect(() => {
    setShowSidebar(false);
  }, [location.pathname]);

  return (

    <div className="dashboard-container">

      {/* OVERLAY */}
      {showSidebar && (
        <div
          className="sidebar-overlay"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <div className={`sidebar ${showSidebar ? "show" : ""}`}>

        <div>

          <h5 className="logo">TEAM PANEL</h5>

          <SidebarLink
            to={`/team/${clientId}/dashboard`}
            active={isActive("dashboard")}
            icon="bi-speedometer2"
            label="Dashboard"
            onClick={() => setShowSidebar(false)}
          />

          <SidebarLink
            to={`/team/${clientId}/worklog`}
            active={isActive("worklog")}
            icon="bi-check2-square"
            label="Daily Work"
            onClick={() => setShowSidebar(false)}
          />

          <SidebarLink
            to={`/team/${clientId}/plan`}
            active={isActive("plan")}
            icon="bi-calendar-check"
            label="Next Month Plan"
            onClick={() => setShowSidebar(false)}
          />

          <SidebarLink
            to={`/team/${clientId}/generate-blog`}
            active={isActive("generate-blog")}
            icon="bi-pencil-square"
            label="Generate Blog"
            onClick={() => setShowSidebar(false)}
          />

        </div>

        {/* FOOTER */}
        <div className="sidebar-footer">

          <small>
            © {new Date().getFullYear()} DigiGrowth Digital
          </small>

          <button
            className="btn btn-outline-light w-100 mt-2"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>
            Sign Out
          </button>

        </div>

      </div>

      {/* MAIN */}
      <div className="main-content">

        {/* TOPBAR */}
        <div className="topbar">

          <div className="d-flex align-items-center gap-2">

            {/* MOBILE MENU BUTTON */}
            <button
              className="btn d-md-none"
              onClick={() => setShowSidebar(true)}
            >
              <i className="bi bi-list fs-4"></i>
            </button>

            <h5 className="mb-0 fw-semibold">Team Dashboard</h5>

          </div>

          <div className="text-muted small">
            {new Date().toDateString()}
          </div>

        </div>

        {/* CONTENT */}
        <div className="page-content">
          <Outlet />
        </div>

      </div>

      {/* ===== STYLES ===== */}
      <style>{`

/* ===== LAYOUT ===== */
.dashboard-container{
  display:flex;
  min-height:100vh;
  background:#f8fafc;
}

/* ===== SIDEBAR ===== */
.sidebar{
  width:240px;
  background:#0f172a;
  color:white;
  padding:20px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  transition:0.3s;
}

/* LOGO */
.logo{
  font-weight:700;
  margin-bottom:20px;
}

/* FOOTER */
.sidebar-footer{
  font-size:12px;
  opacity:0.7;
}

/* LINKS */
.sidebar a{
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px;
  border-radius:8px;
  color:white;
  text-decoration:none;
  margin-bottom:6px;
  transition:0.2s;
}

.sidebar a:hover{
  background:rgba(255,255,255,0.1);
}

.sidebar a.active{
  background:#2563eb;
}

/* ===== MAIN ===== */
.main-content{
  flex:1;
  display:flex;
  flex-direction:column;
}

/* TOPBAR */
.topbar{
  background:white;
  padding:14px 20px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-bottom:1px solid #e5e7eb;
}

/* PAGE */
.page-content{
  padding:20px;
}

/* ===== MOBILE ===== */
@media (max-width:768px){

.sidebar{
  position:fixed;
  left:-100%;
  top:0;
  height:100%;
  z-index:1000;
}

.sidebar.show{
  left:0;
}

/* OVERLAY */
.sidebar-overlay{
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.4);
  z-index:999;
}

}

      `}</style>

    </div>

  );

};

/* ===== SIDEBAR LINK ===== */
const SidebarLink = ({ to, active, icon, label, onClick }) => (

  <Link
    to={to}
    onClick={onClick}
    className={active ? "active" : ""}
  >
    <i className={`bi ${icon}`}></i>
    {label}
  </Link>

);

export default TeamLayout;
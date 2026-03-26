import { Outlet, Link, useParams, useNavigate, useLocation } from "react-router-dom";

const TeamLayout = () => {

  const { clientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname.includes(path);

  return (

    <div className="d-flex">

      {/* SIDEBAR */}
      <div
        className="bg-dark text-white p-3 d-flex flex-column justify-content-between"
        style={{ width: "230px", minHeight: "100vh" }}
      >

        <div>

          <h5 className="mb-4 fw-bold">TEAM PANEL</h5>

          <SidebarLink
            to={`/team/${clientId}/dashboard`}
            active={isActive("dashboard")}
            icon="bi-speedometer2"
            label="Dashboard"
          />

          <SidebarLink
            to={`/team/${clientId}/worklog`}
            active={isActive("worklog")}
            icon="bi-check2-square"
            label="Daily Work"
          />

          <SidebarLink
            to={`/team/${clientId}/plan`}
            active={isActive("plan")}
            icon="bi-calendar-check"
            label="Next Month Plan"
          />

        </div>

        {/* LOGOUT */}
       {/* FOOTER + LOGOUT */}
<div>

  {/* PROFESSIONAL TEXT */}
  <div
    className="text-center text-light mb-3"
    style={{ fontSize: "12px", opacity: 0.7 }}
  >
    © {new Date().getFullYear()} DigiGrowth Digital  
    <br />
    All rights reserved
  </div>

  {/* LOGOUT BUTTON */}
  <button
    className="btn btn-outline-light w-100"
    onClick={handleLogout}
  >
    <i className="bi bi-box-arrow-right me-2"></i>
    Sign Out
  </button>

</div>

      </div>

      {/* CONTENT */}
      <div className="flex-grow-1 bg-light p-4">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h4 className="fw-bold">Team Dashboard</h4>

          <small className="text-muted">
            {new Date().toDateString()}
          </small>

        </div>

        <Outlet />

      </div>

    </div>

  );

};

/* ================= SIDEBAR LINK ================= */

const SidebarLink = ({ to, active, icon, label }) => (

  <Link
    to={to}
    className={`d-flex align-items-center mb-2 px-2 py-2 text-decoration-none rounded ${
      active ? "bg-primary text-white" : "text-white"
    }`}
    style={{
      transition: "0.3s",
      backgroundColor: active ? "" : "transparent"
    }}
  >
    <i className={`bi ${icon} me-2`}></i>
    {label}
  </Link>

);

export default TeamLayout;
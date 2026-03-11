import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const items = [
    { label: "Agency Overview", path: "overview" },
    { label: "Manage Clients", path: "clients" },
    { label: "Monthly Summary", path: "monthly-summary" },
    { label: "Next Month Plan", path: "next-month-plan" },
    { label: "Client Messages", path: "messages" },
    { label: "Team Members", path: "team" },
    { label: "Settings", path: "settings" },
  ];

  /* 🔐 LOGOUT FUNCTION */
  const handleLogout = () => {
    // clear JWT & user data
    logout();

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("clientId");

    // redirect to login
    navigate("/login");
  };

  return (
    <div
      className="bg-dark text-white p-3 d-flex flex-column"
      style={{ width: "260px", minHeight: "100vh" }}
    >
      {/* 🔷 LOGO / TITLE */}
      <div>
        <h5 className="fw-bold mb-0">AGENCYADMIN</h5>
        <small className="text-muted">Super Admin Panel</small>

        {/* 🔷 MENU */}
        <ul className="nav flex-column mt-4 gap-1">
          {items.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `btn w-100 text-start ${
                    isActive ? "btn-primary" : "btn-dark"
                  }`
                }
                style={{ borderRadius: "8px" }}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* 🔷 SIGN OUT BUTTON */}
      <div className="mt-auto pt-3">
        <button
          className="btn btn-outline-light w-100"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

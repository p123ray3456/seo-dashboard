import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const items = [
    { label: "Agency Overview", path: "overview", icon: "bi-speedometer2" },
    { label: "Manage Clients", path: "clients", icon: "bi-people" },
    { label: "Next Month Plan", path: "next-month-plan", icon: "bi-lightbulb" },
    { label: "Client Messages", path: "messages", icon: "bi-chat-dots" },
    { label: "Team Members", path: "team", icon: "bi-person-badge" },
    { label: "Settings", path: "settings", icon: "bi-gear" },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("clientId");
    navigate("/login");
  };

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>

      <div>

        <h4 className="fw-bold text-white mb-3">
          Admin Panel
        </h4>

        <ul className="nav flex-column gap-2">

          {items.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `menu-item d-flex align-items-center gap-3 px-3 py-2 rounded ${
                    isActive ? "active-menu" : "inactive-menu"
                  }`
                }
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </NavLink>
            </li>
          ))}

        </ul>

      </div>

      {/* LOGOUT */}
      <div className="logout-section">
        <button
          className="btn btn-outline-light w-100"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </div>

      {/* MENU STYLES */}
      <style>{`

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

.logout-section{
border-top:1px solid #1e293b;
padding-top:15px;
}

      `}</style>

    </div>
  );
};

export default AdminSidebar;
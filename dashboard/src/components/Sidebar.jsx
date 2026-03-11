import { NavLink, useParams } from "react-router-dom";
const Sidebar = ({ clientName }) => {
  const { clientId } = useParams();

  const items = [
    { label: "Overview", path: "overview", icon: "bi-speedometer2" },
    { label: "Search Console", path: "search-console", icon: "bi-search" },
    { label: "Keyword Performance", path: "keywords", icon: "bi-key" },
    { label: "Traffic Growth", path: "traffic", icon: "bi-graph-up" },
    { label: "Work Log", path: "work-log", icon: "bi-journal-text" },
    { label: "Leads & Conversions", path: "leads", icon: "bi-people" },
    { label: "Monthly Summary", path: "monthly-summary", icon: "bi-calendar-check" },
    { label: "Next Month Plan", path: "next-month-plan", icon: "bi-lightning-charge" },
    { label: "Settings", path: "settings", icon: "bi-gear" },
  ];

  return (
    <div className="h-100 bg-white p-3">
      {/* Header */}
      <h5 className="text-primary fw-bold mb-0">SEO Dashboard</h5>
      <small className="text-muted">{clientName}</small>

      {/* Navigation */}
      <ul className="nav nav-pills flex-column mt-4 gap-1">
        {items.map((item) => (
          <li className="nav-item" key={item.label}>
            <NavLink
              to={`/dashboard/${clientId}/${item.path}`}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 text-start ${
                  isActive ? "active" : "text-dark"
                }`
              }
              style={{ borderRadius: "10px" }}
            >
              <i className={`bi ${item.icon}`} />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

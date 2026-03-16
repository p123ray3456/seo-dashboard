import { useEffect, useState } from "react";
import "../styles/leadsConversions.css";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const LeadsConversions = () => {

  const clientId =
    localStorage.getItem("clientId") ||
    JSON.parse(localStorage.getItem("auth"))?.clientId;

  const [month, setMonth] = useState(getCurrentMonth());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH LEADS DATA ================= */

  useEffect(() => {

    if (!clientId) return;

    setLoading(true);

    fetch(
      `https://seo-dashboard-production-ec44.up.railway.app/seo/leads?clientId=${clientId}&month=${month}`
    )
      .then((res) => res.json())
      .then((res) => {

        setData(res);
        setLoading(false);

      })
      .catch((err) => {

        console.error("Leads fetch error:", err);
        setLoading(false);

      });

  }, [clientId, month]);

  if (loading)
    return <div className="lc-wrapper container-fluid">Loading Leads Data...</div>;

  if (!data)
    return <div className="lc-wrapper container-fluid">No leads data available</div>;

  /* ================= CALCULATIONS ================= */

  const conversionRate =
    data.totalLeads === 0
      ? 0
      : ((data.converted / data.totalLeads) * 100).toFixed(1);

  const conversionActions = [
    {
      label: "Converted Leads",
      value: data.converted,
      icon: "bi-check-circle",
      color: "green",
    },
    {
      label: "Pending Leads",
      value: data.totalLeads - data.converted,
      icon: "bi-hourglass",
      color: "orange",
    },
  ];

  const leadSources =
    data.sourceBreakdown?.map((item, index) => ({
      name: item.source,
      value: item.leads,
      color: COLORS[index % COLORS.length],
    })) || [];

  return (

    <div className="lc-wrapper container-fluid">

      {/* HEADER */}

      <div className="lc-header">

        <div>
          <h4>Leads & Conversions</h4>
          <p>Track the business impact of your traffic.</p>
        </div>

        <select
          className="form-select"
          style={{ maxWidth: "180px" }}
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {getLastMonths().map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

      </div>


      {/* METRICS */}

      <div className="lc-metrics">

        <MetricCard
          title="Total Leads"
          value={data.totalLeads}
          icon="bi-people"
        />

        <MetricCard
          title="Converted Leads"
          value={data.converted}
          subtitle={`${conversionRate}% conversion rate`}
          icon="bi-graph-up"
        />

      </div>


      {/* GRID */}

      <div className="lc-grid">

        {/* CONVERSION OVERVIEW */}

        <div className="lc-card">

          <h6>Conversion Overview</h6>

          {conversionActions.map((item, i) => (

            <div key={i} className="lc-action">

              <div className={`lc-icon ${item.color}`}>
                <i className={`bi ${item.icon}`} />
              </div>

              <span>{item.label}</span>

              <strong>{item.value}</strong>

            </div>

          ))}

        </div>


        {/* PIE CHART */}

        <div className="lc-card">

          <h6>Lead Sources</h6>

          <div className="lc-chart">

            <ResponsiveContainer width="100%" height={220}>

              <PieChart>

                <Pie
                  data={leadSources}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >

                  {leadSources.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

          <ul className="lc-legend">

            {leadSources.map((src, i) => (

              <li key={i}>

                <span
                  className="dot"
                  style={{ background: src.color }}
                />

                {src.name}

              </li>

            ))}

          </ul>

        </div>

      </div>

    </div>

  );
};

/* ================= UTIL ================= */

function getCurrentMonth() {
  const date = new Date();
  return date.toISOString().slice(0, 7);
}

function getLastMonths() {

  const months = [];
  const date = new Date();

  for (let i = 0; i < 12; i++) {

    const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
    const month = d.toISOString().slice(0, 7);

    months.push(month);

  }

  return months;

}

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#64748b",
];

/* ================= METRIC CARD ================= */

const MetricCard = ({ title, value, subtitle, icon }) => (

  <div className="lc-metric">

    <div className="lc-metric-icon">
      <i className={`bi ${icon}`} />
    </div>

    <div>

      <small>{title}</small>

      <h3>{value}</h3>

      <span className="lc-sub">{subtitle}</span>

    </div>

  </div>

);

export default LeadsConversions;
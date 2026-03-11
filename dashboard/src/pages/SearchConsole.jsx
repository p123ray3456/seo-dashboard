import { useState, useEffect, useMemo } from "react";
import "../styles/searchConsole.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const SearchConsole = () => {
  const [range, setRange] = useState(30);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(null);

  /* ================================
     FETCH SEARCH CONSOLE DATA
  ================================== */

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ get clientId from login session
        const clientId = localStorage.getItem("clientId");

        if (!clientId) {
          setError("Client not found");
          return;
        }

        const res = await fetch(
          `http://localhost:5000/seo/search-console?clientId=${clientId}&range=${range}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error("API failed");
        }

        const data = await res.json();

        setApiData(data.rows || []);
      } catch (err) {
        console.error("Search console error:", err);
        setError("Unable to load Search Console data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  /* ================================
     KPI METRICS
  ================================== */

  const metrics = useMemo(() => {
    if (!apiData.length) return null;

    let impressions = 0;
    let clicks = 0;
    let position = 0;

    apiData.forEach((row) => {
      impressions += row.impressions || 0;
      clicks += row.clicks || 0;
      position += row.position || 0;
    });

    const ctr = impressions ? (clicks / impressions) * 100 : 0;

    return {
      impressions,
      clicks,
      ctr: ctr.toFixed(2),
      position: (position / apiData.length).toFixed(1),
    };
  }, [apiData]);

  /* ================================
     TABLE DATA
  ================================== */

  const queryRows = apiData.map((row) => ({
    label: row.keys?.[0] || "keyword",
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: (row.ctr * 100).toFixed(2),
    position: row.position?.toFixed(1),
  }));

  const filteredRows = queryRows.filter((row) =>
    row.label.toLowerCase().includes(search.toLowerCase())
  );

  /* ================================
     CHART DATA
  ================================== */

  const chartData = apiData.slice(0, 12).map((row) => ({
    keyword: row.keys?.[0],
    clicks: row.clicks,
    impressions: row.impressions,
  }));

  return (
    <div className="sc-wrapper">

      {/* HEADER */}
      <div className="sc-header">

        <div>
          <h3 className="fw-bold">Search Console Performance</h3>
          <p className="text-muted">
            Live data directly from Google Search Console
          </p>
        </div>

        <select
          className="form-select"
          style={{ width: "160px" }}
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>

      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-danger mt-3">{error}</div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="mt-4">Loading Search Console Data...</div>
      ) : (
        <>

          {/* ================= KPI CARDS ================= */}

          <div className="row g-4 mt-1">

            <div className="col-md-3">
              <div className="card shadow-sm border-0 p-3">
                <small>Total Impressions</small>
                <h3 className="fw-bold">{metrics?.impressions}</h3>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-0 p-3">
                <small>Total Clicks</small>
                <h3 className="fw-bold">{metrics?.clicks}</h3>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-0 p-3">
                <small>Average CTR</small>
                <h3 className="fw-bold">{metrics?.ctr}%</h3>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm border-0 p-3">
                <small>Average Position</small>
                <h3 className="fw-bold">{metrics?.position}</h3>
              </div>
            </div>

          </div>

          {/* ================= CHART ================= */}

          <div className="card shadow-sm border-0 mt-4 p-3">

            <h5 className="mb-3">Clicks vs Impressions</h5>

            <ResponsiveContainer width="100%" height={280}>

              <LineChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="keyword" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#2563eb"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="impressions"
                  stroke="#16a34a"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

          {/* ================= FILTER ================= */}

          <div className="mt-4 mb-2">

            <input
              className="form-control"
              placeholder="Search keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          {/* ================= TABLE ================= */}

          <div className="card shadow-sm border-0 p-3">

            <h5 className="mb-3">Top Search Queries</h5>

            <table className="table">

              <thead className="table-light">
                <tr>
                  <th>Query</th>
                  <th>Clicks</th>
                  <th>Impressions</th>
                  <th>CTR</th>
                  <th>Position</th>
                </tr>
              </thead>

              <tbody>

                {filteredRows.slice(0, 20).map((row, i) => (
                  <tr key={i}>
                    <td>{row.label}</td>
                    <td>{row.clicks}</td>
                    <td>{row.impressions}</td>
                    <td>{row.ctr}%</td>
                    <td>{row.position}</td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </>
      )}
    </div>
  );
};

export default SearchConsole;
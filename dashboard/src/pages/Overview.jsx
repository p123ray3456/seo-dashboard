import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Overview = () => {
  const { clientId } = useParams();

  const [range, setRange] = useState(30);
  const [client, setClient] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CLIENT ================= */

  useEffect(() => {
    fetch(`http://localhost:5000/clients/${clientId}`)
      .then(res => res.json())
      .then(data => setClient(data))
      .catch(err => console.log(err));
  }, [clientId]);

  /* ================= FETCH REAL GSC OVERVIEW ================= */

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/seo/overview?clientId=${clientId}&range=${range}`
        );

        const data = await res.json();
        setOverviewData(data);

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [clientId, range]);

  /* ================= KPI CALCULATION ================= */

  let totalClicks = 0;
  let totalImpressions = 0;
  let avgCTR = 0;
  let avgPosition = 0;

  if (overviewData?.dateRows?.length) {
    overviewData.dateRows.forEach(row => {
      totalClicks += row.clicks || 0;
      totalImpressions += row.impressions || 0;
      avgCTR += row.ctr || 0;
      avgPosition += row.position || 0;
    });

    avgCTR = ((avgCTR / overviewData.dateRows.length) * 100).toFixed(2);
    avgPosition = (avgPosition / overviewData.dateRows.length).toFixed(1);
  }

  if (loading) return <div>Loading Overview...</div>;

  return (
    <div>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Dashboard Overview</h4>
          <p className="text-muted mb-0">
            Real-time performance from Google Search Console.
          </p>
        </div>

        <select
          className="form-select w-auto"
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      {/* KPI CARDS */}
      <div className="row g-4">

        <Card title="Total Clicks" value={totalClicks} growth="From Google Search" />

        <Card title="Total Impressions" value={totalImpressions} growth="Search Visibility" />

        <Card title="Average CTR" value={`${avgCTR}%`} growth="Click Performance" />

        <Card title="Average Position" value={avgPosition} growth="Ranking Position" />

      </div>

      {/* TOP QUERIES & PAGES */}
      <div className="row mt-4 g-4">

        {/* TOP QUERIES */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Top Search Queries</h5>

            {overviewData?.queryRows?.map((row, i) => (
              <div key={i} className="mb-2">
                {row.keys[0]}
              </div>
            ))}
          </div>
        </div>

        {/* TOP PAGES */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Top Pages</h5>

            {overviewData?.pageRows?.map((row, i) => (
              <div key={i} className="mb-2">
                {row.keys[0]}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};


/* ================= KPI CARD COMPONENT ================= */

const Card = ({ title, value, growth }) => (
  <div className="col-md-3">
    <div
      className="card border-0 shadow-sm p-4 h-100"
      style={{ borderRadius: "14px" }}
    >
      <h6 className="text-muted mb-2">{title}</h6>

      <div className="d-flex justify-content-between align-items-center">
        <h3 className="fw-bold mb-0">{value || "-"}</h3>
        <div
          style={{
            background: "#f1f4ff",
            padding: "8px",
            borderRadius: "10px"
          }}
        >
          📊
        </div>
      </div>

      <small className="text-muted mt-2">{growth}</small>
    </div>
  </div>
);

export default Overview;
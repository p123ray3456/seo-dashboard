import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

const API = "https://seo-dashboard-production-ec44.up.railway.app";

const Overview = () => {

  const { clientId } = useParams();

  const [range, setRange] = useState(30);
  const [client, setClient] = useState(null);
  const [overviewData, setOverviewData] = useState({
    dateRows: [],
    queryRows: [],
    pageRows: []
  });
  const [loading, setLoading] = useState(true);

  /* ================= FETCH CLIENT ================= */

  useEffect(() => {
    if (!clientId) return;

    fetch(`${API}/clients/${clientId}`)
      .then(res => res.json())
      .then(data => setClient(data))
      .catch(err => console.log(err));
  }, [clientId]);

  /* ================= FETCH OVERVIEW ================= */

  useEffect(() => {
    if (!clientId) return;

    const fetchOverview = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API}/seo/overview?clientId=${clientId}&range=${range}`
        );

        const data = await res.json();

        setOverviewData({
          dateRows: data?.dateRows || [],
          queryRows: data?.queryRows || [],
          pageRows: data?.pageRows || []
        });

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();

  }, [clientId, range]);

  /* ================= KPI ================= */

  let totalClicks = 0;
  let totalImpressions = 0;
  let avgCTR = 0;
  let avgPosition = 0;

  const rows = overviewData.dateRows;

  rows.forEach(row => {
    totalClicks += Number(row.clicks) || 0;
    totalImpressions += Number(row.impressions) || 0;
    avgCTR += Number(row.ctr) || 0;
    avgPosition += Number(row.position) || 0;
  });

  if (rows.length > 0) {
    avgCTR = ((avgCTR / rows.length) * 100).toFixed(2);
    avgPosition = (avgPosition / rows.length).toFixed(1);
  }

  /* ================= PDF ================= */

  const downloadPDF = () => {
    const pdf = new jsPDF();

    pdf.text("SEO Report", 20, 30);
    pdf.text(`Client: ${client?.name || "-"}`, 20, 50);
    pdf.text(`Website: ${client?.domain || "-"}`, 20, 60);
    pdf.text(`Range: Last ${range} Days`, 20, 70);

    pdf.addPage();

    pdf.text(`Clicks: ${totalClicks}`, 20, 30);
    pdf.text(`Impressions: ${totalImpressions}`, 20, 40);
    pdf.text(`CTR: ${avgCTR}%`, 20, 50);
    pdf.text(`Position: ${avgPosition}`, 20, 60);

    pdf.save("report.pdf");
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container-fluid px-3 px-md-4">

      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">

        <div>
          <h4 className="mb-1">Dashboard Overview</h4>
          <p className="text-muted mb-0">Google Search Console Data</p>
        </div>

        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">

          <select
            className="form-select"
            value={range}
            onChange={(e)=>setRange(Number(e.target.value))}
          >
            <option value={7}>7 Days</option>
            <option value={30}>30 Days</option>
            <option value={90}>90 Days</option>
          </select>

          <button className="btn btn-primary w-100" onClick={downloadPDF}>
            Download
          </button>

        </div>

      </div>

      {/* KPI CARDS */}
      <div className="row g-3">

        <Card title="Clicks" value={totalClicks} />
        <Card title="Impressions" value={totalImpressions} />
        <Card title="CTR" value={`${avgCTR}%`} />
        <Card title="Position" value={avgPosition} />

      </div>

      {/* DATA */}
      <div className="row mt-4 g-3">

        <div className="col-12 col-md-6">
          <div className="card p-3 h-100">
            <h5>Top Queries</h5>

            {overviewData.queryRows.length > 0 ? (
              overviewData.queryRows.map((row,i)=>(
                <div key={i} className="text-truncate">
                  {row.keys?.[0] || "-"}
                </div>
              ))
            ) : <p>No data</p>}
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card p-3 h-100">
            <h5>Top Pages</h5>

            {overviewData.pageRows.length > 0 ? (
              overviewData.pageRows.map((row,i)=>(
                <div key={i} className="text-truncate">
                  {row.keys?.[0] || "-"}
                </div>
              ))
            ) : <p>No data</p>}
          </div>
        </div>

      </div>

    </div>
  );
};

/* ================= CARD ================= */

const Card = ({ title, value }) => (
  <div className="col-12 col-sm-6 col-md-3">
    <div className="card p-3 h-100 text-center">
      <h6 className="text-muted">{title}</h6>
      <h3>{value ?? "-"}</h3>
    </div>
  </div>
);

export default Overview;
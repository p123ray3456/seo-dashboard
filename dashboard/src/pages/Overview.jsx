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

    fetch(`${API}/clients/${clientId}`)
      .then(res => res.json())
      .then(data => setClient(data))
      .catch(err => console.log(err));

  }, [clientId]);

  /* ================= FETCH OVERVIEW ================= */

  useEffect(() => {

    const fetchOverview = async () => {

      try {

        setLoading(true);

        const res = await fetch(
          `${API}/seo/overview?clientId=${clientId}&range=${range}`
        );

        const data = await res.json();

        console.log("OVERVIEW RESPONSE:", data);

        // ✅ SAFE MAPPING (IMPORTANT FIX)
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

  /* ================= KPI CALCULATION ================= */

  let totalClicks = 0;
  let totalImpressions = 0;
  let avgCTR = 0;
  let avgPosition = 0;

  const rows = overviewData?.dateRows || [];

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

    pdf.setFontSize(20);
    pdf.text("SEO Report", 20, 30);

    pdf.setFontSize(12);
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

  /* ================= UI ================= */

  if (loading) return <div>Loading...</div>;

  return (

    <div className="container-fluid">

      <div className="d-flex justify-content-between mb-4">

        <div>
          <h4>Dashboard Overview</h4>
          <p>Google Search Console Data</p>
        </div>

        <div className="d-flex gap-2">

          <select value={range} onChange={(e)=>setRange(e.target.value)}>
            <option value={7}>7 Days</option>
            <option value={30}>30 Days</option>
            <option value={90}>90 Days</option>
          </select>

          <button onClick={downloadPDF}>
            Download
          </button>

        </div>

      </div>

      {/* KPI */}

      <div className="row">

        <Card title="Clicks" value={totalClicks} />
        <Card title="Impressions" value={totalImpressions} />
        <Card title="CTR" value={`${avgCTR}%`} />
        <Card title="Position" value={avgPosition} />

      </div>

      {/* QUERY */}

      <div className="row mt-4">

        <div className="col-md-6">

          <h5>Top Queries</h5>

          {overviewData.queryRows.length > 0 ? (
            overviewData.queryRows.map((row,i)=>(
              <div key={i}>{row.keys[0]}</div>
            ))
          ) : (
            <p>No data</p>
          )}

        </div>

        <div className="col-md-6">

          <h5>Top Pages</h5>

          {overviewData.pageRows.length > 0 ? (
            overviewData.pageRows.map((row,i)=>(
              <div key={i}>{row.keys[0]}</div>
            ))
          ) : (
            <p>No data</p>
          )}

        </div>

      </div>

    </div>

  );

};

const Card = ({ title, value }) => (

  <div className="col-md-3">

    <div className="card p-3">

      <h6>{title}</h6>
      <h3>{value !== undefined ? value : "-"}</h3>

    </div>

  </div>

);

export default Overview;
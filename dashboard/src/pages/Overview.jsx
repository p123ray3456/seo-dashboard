import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

const API = "https://seo-dashboard-production-ec44.up.railway.app";

const Overview = () => {

  const { clientId } = useParams();

  const [range, setRange] = useState(30);
  const [client, setClient] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
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

        console.log("Overview Data:", data); // DEBUG

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

  if (overviewData && Array.isArray(overviewData.dateRows)) {

    overviewData.dateRows.forEach(row => {
      totalClicks += Number(row.clicks) || 0;
      totalImpressions += Number(row.impressions) || 0;
      avgCTR += Number(row.ctr) || 0;
      avgPosition += Number(row.position) || 0;
    });

    if (overviewData.dateRows.length > 0) {
      avgCTR = ((avgCTR / overviewData.dateRows.length) * 100).toFixed(2);
      avgPosition = (avgPosition / overviewData.dateRows.length).toFixed(1);
    }

  }

  /* ================= PDF REPORT ================= */

  const downloadPDF = () => {

    const pdf = new jsPDF();

    pdf.setFontSize(22);
    pdf.text("SEO Performance Report", 20, 30);

    pdf.setFontSize(12);
    pdf.text(`Client: ${client?.name || "Client"}`, 20, 50);
    pdf.text(`Website: ${client?.domain || "-"}`, 20, 60);
    pdf.text(`Date Range: Last ${range} Days`, 20, 70);

    pdf.addPage();

    pdf.setFontSize(18);
    pdf.text("SEO Performance Metrics", 20, 30);

    pdf.setFontSize(12);
    pdf.text(`Total Clicks: ${totalClicks}`, 20, 50);
    pdf.text(`Total Impressions: ${totalImpressions}`, 20, 60);
    pdf.text(`Average CTR: ${avgCTR}%`, 20, 70);
    pdf.text(`Average Position: ${avgPosition}`, 20, 80);

    pdf.addPage();

    pdf.setFontSize(18);
    pdf.text("Top Search Queries", 20, 30);

    let y = 50;

    overviewData?.queryRows?.slice(0,10).forEach((row,index)=>{
      pdf.setFontSize(12);
      pdf.text(`${index+1}. ${row.keys[0]}`,20,y);
      y += 10;
    });

    pdf.addPage();

    pdf.setFontSize(18);
    pdf.text("Top Ranking Pages",20,30);

    let pageY = 50;

    overviewData?.pageRows?.slice(0,10).forEach((row,index)=>{
      pdf.setFontSize(12);
      pdf.text(`${index+1}. ${row.keys[0]}`,20,pageY);
      pageY += 10;
    });

    pdf.save("SEO_Report.pdf");

  };

  /* ================= LOADING ================= */

  if (loading) return <div>Loading Overview...</div>;

  if (!overviewData) return <div>No Data Found</div>;

  /* ================= UI ================= */

  return (

    <div className="container-fluid">

      {/* HEADER */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">

        <div>
          <h4 className="fw-bold mb-1">Dashboard Overview</h4>
          <p className="text-muted mb-0">
            Real-time performance from Google Search Console.
          </p>
        </div>

        <div className="d-flex gap-2">

          <select
            className="form-select"
            style={{ maxWidth: "180px" }}
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={downloadPDF}
          >
            Download Report
          </button>

        </div>

      </div>

      {/* KPI CARDS */}

      <div className="row g-4">

        <Card title="Total Clicks" value={totalClicks} growth="From Google Search" />
        <Card title="Total Impressions" value={totalImpressions} growth="Search Visibility" />
        <Card title="Average CTR" value={`${avgCTR}%`} growth="Click Performance" />
        <Card title="Average Position" value={avgPosition} growth="Ranking Position" />

      </div>

      {/* TABLES */}

      <div className="row mt-4 g-4">

        <div className="col-lg-6 col-12">

          <div className="card border-0 shadow-sm p-4 h-100">

            <h5 className="fw-bold mb-3">Top Search Queries</h5>

            {overviewData?.queryRows?.length ? (

              overviewData.queryRows.map((row, i) => (
                <div key={i} className="border-bottom py-2">
                  {row.keys[0]}
                </div>
              ))

            ) : (
              <div className="text-muted">No Query Data</div>
            )}

          </div>

        </div>

        <div className="col-lg-6 col-12">

          <div className="card border-0 shadow-sm p-4 h-100">

            <h5 className="fw-bold mb-3">Top Pages</h5>

            {overviewData?.pageRows?.length ? (

              overviewData.pageRows.map((row, i) => (
                <div key={i} className="border-bottom py-2">
                  {row.keys[0]}
                </div>
              ))

            ) : (
              <div className="text-muted">No Page Data</div>
            )}

          </div>

        </div>

      </div>

    </div>

  );

};

/* ================= CARD ================= */

const Card = ({ title, value, growth }) => (

  <div className="col-xl-3 col-md-6 col-12">

    <div className="card border-0 shadow-sm p-4 h-100">

      <h6 className="text-muted mb-2">{title}</h6>

      <div className="d-flex justify-content-between align-items-center">

        <h3 className="fw-bold mb-0">
          {value !== undefined && value !== null ? value : "-"}
        </h3>

        <div style={{ background: "#f1f4ff", padding: "8px", borderRadius: "10px" }}>
          📊
        </div>

      </div>

      <small className="text-muted mt-2">{growth}</small>

    </div>

  </div>

);

export default Overview;
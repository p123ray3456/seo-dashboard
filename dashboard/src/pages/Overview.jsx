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

  useEffect(() => {
    if (!clientId) return;

    fetch(`${API}/clients/${clientId}`)
      .then(res => res.json())
      .then(data => setClient(data))
      .catch(err => console.log(err));
  }, [clientId]);

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

  const downloadPDF = () => {
    const pdf = new jsPDF();
    let y = 20;
    const pageWidth = pdf.internal.pageSize.getWidth();

    const checkPageBreak = () => {
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    };

    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("SEO Performance Report", pageWidth / 2, y, { align: "center" });
    y += 12;

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text("Generated from SEO Dashboard", pageWidth / 2, y, { align: "center" });
    y += 15;

    pdf.setFont("helvetica", "bold");
    pdf.text("Client Information", 14, y);
    y += 8;

    pdf.setFont("helvetica", "normal");
    pdf.text(`Client: ${client?.name || "-"}`, 14, y);
    y += 7;
    pdf.text(`Website: ${client?.domain || "-"}`, 14, y);
    y += 7;
    pdf.text(`Range: Last ${range} Days`, 14, y);
    y += 12;

    pdf.setFont("helvetica", "bold");
    pdf.text("Performance Summary", 14, y);
    y += 8;

    pdf.setFont("helvetica", "normal");
    pdf.text(`Clicks: ${totalClicks}`, 14, y);
    y += 7;
    pdf.text(`Impressions: ${totalImpressions}`, 14, y);
    y += 7;
    pdf.text(`CTR: ${avgCTR}%`, 14, y);
    y += 7;
    pdf.text(`Position: ${avgPosition}`, 14, y);
    y += 12;

    pdf.setFont("helvetica", "bold");
    pdf.text("Top Queries", 14, y);
    y += 8;

    overviewData.queryRows.forEach((row, index) => {
      checkPageBreak();
      const query = row.keys?.[0] || "-";

      pdf.setFont("helvetica", "bold");
      pdf.text(`${index + 1}. ${query}`, 14, y);
      y += 6;

      pdf.setFont("helvetica", "normal");
      pdf.text(`Clicks: ${row.clicks ?? 0} | Impressions: ${row.impressions ?? 0}`, 18, y);
      y += 8;
    });

    checkPageBreak();

    pdf.setFont("helvetica", "bold");
    pdf.text("Top Pages", 14, y);
    y += 8;

    overviewData.pageRows.forEach((row, index) => {
      checkPageBreak();
      const page = row.keys?.[0] || "-";

      pdf.setFont("helvetica", "bold");
      pdf.text(`${index + 1}. ${page}`, 14, y);
      y += 6;

      pdf.setFont("helvetica", "normal");
      pdf.text(`Clicks: ${row.clicks ?? 0} | Impressions: ${row.impressions ?? 0}`, 18, y);
      y += 8;
    });

    pdf.save("SEO_Report.pdf");
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container-fluid px-3 px-md-4">

      {/* HEADER */}
      <div className="top-header mb-4">

        <div>
          <h3 className="main-title">📊 Dashboard Overview</h3>
          <p className="subtitle">Track your SEO performance</p>
        </div>

        <div className="top-actions">

          <select
            className="range-select"
            value={range}
            onChange={(e)=>setRange(Number(e.target.value))}
          >
            <option value={7}>7 Days</option>
            <option value={30}>30 Days</option>
            <option value={90}>90 Days</option>
          </select>

          <button className="download-btn" onClick={downloadPDF}>
            ⬇ Download
          </button>

        </div>

      </div>

      {/* KPI */}
      <div className="row g-3">
        <Card title="Clicks" value={totalClicks} icon="👆"/>
        <Card title="Impressions" value={totalImpressions} icon="👁"/>
        <Card title="CTR" value={`${avgCTR}%`} icon="📈"/>
        <Card title="Position" value={avgPosition} icon="🎯"/>
      </div>

      {/* DATA */}
      <div className="row mt-4 g-3">

        <div className="col-md-6">
          <div className="card p-3 shadow-sm custom-card">
            <h5 className="mb-3">🔍 Top Queries</h5>

            {overviewData.queryRows.map((row,i)=>(
              <div key={i} className="data-row">
                <span className="icon">🔍</span>
                <span className="text-truncate">{row.keys?.[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 shadow-sm custom-card">
            <h5 className="mb-3">📄 Top Pages</h5>

            {overviewData.pageRows.map((row,i)=>(
              <div key={i} className="data-row">
                <span className="icon">📄</span>
                <span className="text-truncate">{row.keys?.[0]}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* STYLE */}
      <style>{`
        .top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .main-title {
          font-weight: 700;
        }

        .subtitle {
          font-size: 14px;
          color: #6c757d;
        }

        .top-actions {
          display: flex;
          gap: 10px;
          flex-wrap: nowrap;
        }

        .range-select {
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #ddd;
          min-width: 120px;
        }

        .download-btn {
          padding: 10px 16px;
          border-radius: 10px;
          border: none;
          background: #0d6efd;
          color: white;
          font-weight: 500;
          white-space: nowrap;
        }

        .download-btn:hover {
          background: #0b5ed7;
        }

        .custom-card {
          border-radius: 12px;
        }

        .data-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }

        .icon {
          font-size: 16px;
        }

      `}</style>

    </div>
  );
};

/* CARD */
const Card = ({ title, value, icon }) => (
  <div className="col-md-3">
    <div className="card p-3 text-center shadow-sm custom-card">
      <div style={{ fontSize: "22px" }}>{icon}</div>
      <h6 className="text-muted mt-2">{title}</h6>
      <h4 className="fw-bold">{value}</h4>
    </div>
  </div>
);

export default Overview;
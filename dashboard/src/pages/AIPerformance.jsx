import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AIPerformance = () => {
  const { clientId } = useParams();

  const [aiPages, setAiPages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [avgRank, setAvgRank] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);

  /* ================= HANDLE RESIZE ================= */

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    setLoading(true);

    fetch(`https://seo-dashboard-production-ec44.up.railway.app/api/ai-engine/${clientId}`)
      .then(res => res.json())
      .then(res => {
        const pages = res.pages || [];

        setAiPages(pages);
        setTotalPages(res.totalPages || 0);

        if (pages.length > 0) {
          const avg =
            pages.reduce((acc, p) => acc + (p.position || 0), 0) /
            pages.length;

          setAvgRank(Math.round(avg));
        } else {
          setAvgRank(0);
        }

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });

  }, [clientId]);

  /* ================= GRAPH DATA ================= */

  const graphData = aiPages.map((p, index) => ({
    name: isMobile ? index + 1 : "P" + (index + 1),
    position: p.position || 0
  }));

  /* ================= UI ================= */

  return (
    <div className="container-fluid p-2 p-md-4">

      <h2 className="mb-4 fw-bold text-center text-md-start">
        AI Performance
      </h2>

      {/* ===== CARDS ===== */}

      <div className="row g-3 mb-4">

        <div className="col-12 col-md-6 col-lg-4">
          <div className="card p-3 bg-primary text-white shadow text-center text-md-start">
            <h6>AI Pages Found</h6>
            <h2>{totalPages}</h2>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <div className="card p-3 bg-success text-white shadow text-center text-md-start">
            <h6>Avg Rank</h6>
            <h2>{avgRank}</h2>
          </div>
        </div>

      </div>

      {/* ===== RESPONSIVE GRAPH ===== */}

      <div className="card p-2 p-md-3 mb-4 shadow">
        <h5 className="text-center text-md-start">AI Position Trend</h5>

        {graphData.length === 0 ? (
          <p className="text-center">No data available</p>
        ) : (
          <div style={{ width: "100%", height: isMobile ? 220 : 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  interval={isMobile ? "preserveStartEnd" : 0}
                />

                <YAxis
                  reversed
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />

                <Tooltip
                  contentStyle={{
                    fontSize: isMobile ? "12px" : "14px"
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="position"
                  stroke="#6f42c1"
                  strokeWidth={2}
                  dot={{ r: isMobile ? 2 : 4 }}
                  activeDot={{ r: isMobile ? 4 : 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ===== AI PAGES ===== */}

      <div className="card p-2 p-md-3 shadow">
        <h5 className="text-center text-md-start">
          AI Citation Pages (Auto)
        </h5>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : aiPages.length === 0 ? (
          <p className="text-center">No AI pages found</p>
        ) : (
          <div>
            {aiPages.map((page, index) => (
              <div
                key={index}
                className="border-bottom pb-2 mb-3"
              >

                <a
                  href={page.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ wordBreak: "break-word" }}
                >
                  <b>{page.title}</b>
                </a>

                <div style={{ fontSize: "13px" }}>
                  Keyword: {page.keyword}
                </div>

                <div style={{ fontSize: "13px" }}>
                  Position: {page.position}
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#777",
                    wordBreak: "break-word"
                  }}
                >
                  {page.url}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AIPerformance;
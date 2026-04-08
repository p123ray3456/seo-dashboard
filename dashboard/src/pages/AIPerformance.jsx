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

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    setLoading(true);

    fetch(`https://seo-dashboard-production-ec44.up.railway.app/api/ai-engine/${clientId}`)
      .then(res => res.json())
      .then(res => {
        const pages = res.pages || [];

        setAiPages(pages);
        setTotalPages(res.totalPages || 0);

        // 🔥 CALCULATE AVG RANK
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
    name: "P" + (index + 1),
    position: p.position || 0
  }));

  /* ================= UI ================= */

  return (
    <div className="container-fluid p-4">

      <h2 className="mb-4 fw-bold">AI Performance</h2>

      {/* ===== CARDS ===== */}

      <div className="row mb-4">

        <div className="col-md-4">
          <div className="card p-3 bg-primary text-white shadow">
            <h6>AI Pages Found</h6>
            <h2>{totalPages}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 bg-success text-white shadow">
            <h6>Avg Rank</h6>
            <h2>{avgRank}</h2>
          </div>
        </div>

      </div>

      {/* ===== GRAPH ===== */}

      <div className="card p-3 mb-4 shadow">
        <h5>AI Position Trend</h5>

        {graphData.length === 0 ? (
          <p>No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis reversed /> {/* 🔥 lower position = better */}
              <Tooltip />
              <Line
                type="monotone"
                dataKey="position"
                stroke="#6f42c1"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ===== AI PAGES ===== */}

      <div className="card p-3 shadow">
        <h5>AI Citation Pages (Auto)</h5>

        {loading ? (
          <p>Loading...</p>
        ) : aiPages.length === 0 ? (
          <p>No AI pages found</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {aiPages.map((page, index) => (
              <li key={index} style={{ marginBottom: "15px" }}>

                <a href={page.url} target="_blank" rel="noreferrer">
                  <b>{page.title}</b>
                </a>

                <div style={{ fontSize: "13px" }}>
                  Keyword: {page.keyword}
                </div>

                <div style={{ fontSize: "13px" }}>
                  Position: {page.position}
                </div>

                <div style={{ fontSize: "12px", color: "#777" }}>
                  {page.url}
                </div>

              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default AIPerformance;
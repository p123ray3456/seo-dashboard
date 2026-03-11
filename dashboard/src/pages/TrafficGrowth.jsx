import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/trafficGrowth.css";

const TrafficGrowth = () => {

  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);
  const [data, setData] = useState(null);

  const clientId =
    localStorage.getItem("clientId") ||
    JSON.parse(localStorage.getItem("auth"))?.clientId;

  /* ================= FETCH DATA ================= */

  useEffect(() => {

    if (!clientId) return;

    const fetchTraffic = async () => {

      try {

        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/seo/traffic-growth?clientId=${clientId}&range=${range}`
        );

        const result = await res.json();

        setData(result);

      } catch (err) {

        console.error("Traffic API error:", err);

      } finally {

        setLoading(false);

      }

    };

    fetchTraffic();

  }, [clientId, range]);

  /* ================= STATES ================= */

  if (loading) {
    return <div className="tg-wrapper">Loading traffic data...</div>;
  }

  if (!data) {
    return <div className="tg-wrapper">No data available</div>;
  }

  /* ================= FIXED CHART DATA ================= */

  const chartData =
    data.chart?.map((row) => ({
      date: row.date,
      clicks: row.clicks,
    })) || [];

  return (

    <div className="tg-wrapper">

      {/* HEADER */}

      <div className="tg-header">

        <div>
          <h4>Organic Traffic Growth</h4>
          <p>Real performance from Google Search Console</p>
        </div>

        <select
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>

      </div>


      {/* METRIC CARDS */}

      <div className="tg-metrics">

        <MetricCard
          title="Total Clicks"
          value={data.currentClicks}
        />

        <MetricCard
          title="Previous Period"
          value={data.previousClicks}
        />

        <MetricCard
          title="Growth"
          value={`${data.growth}%`}
          color={data.growth >= 0 ? "green" : "red"}
        />

      </div>


      {/* CHART */}

      <div className="tg-chart">

        <h6>Daily Click Trend</h6>

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={chartData}>

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#0d6efd"
              strokeWidth={3}
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

};


/* ================= COMPONENT ================= */

const MetricCard = ({ title, value, color }) => (

  <div className="tg-metric-card">

    <small>{title}</small>

    <h3 style={{ color: color || "#111" }}>
      {value || "-"}
    </h3>

  </div>

);

export default TrafficGrowth;
import "../styles/monthlySummary.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MonthlySummary = () => {

  const { clientId } = useParams();

  const [summary, setSummary] = useState(null);

  /* ================= GET LAST MONTH ================= */

  const getLastMonth = () => {

    const now = new Date();

    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    return lastMonth.toISOString().slice(0,7); // YYYY-MM

  };

  /* ================= LOAD DATA ================= */

  useEffect(() => {

    const loadSummary = async () => {

      try {

        const res = await fetch(
          `https://seo-dashboard-production-ec44.up.railway.app/worklog-history/${clientId}`
        );

        const data = await res.json();

        const lastMonth = getLastMonth();

        /* FILTER LAST MONTH DATA */

        const monthlyLogs = data.filter(log =>
          log.date.startsWith(lastMonth)
        );

        if (monthlyLogs.length === 0) {
          setSummary(null);
          return;
        }

        /* GENERATE SUMMARY */

        let onPageCount = 0;
        let technicalCount = 0;
        let offPageCount = 0;

        monthlyLogs.forEach(log => {

          onPageCount += log.onPage?.length || 0;
          technicalCount += log.technical?.length || 0;
          offPageCount += log.offPage?.length || 0;

        });

        setSummary({
          month: lastMonth,
          onPageCount,
          technicalCount,
          offPageCount,
          totalDays: monthlyLogs.length
        });

      } catch (err) {
        console.log(err);
      }

    };

    loadSummary();

  }, [clientId]);

  /* ================= UI ================= */

  if (!summary) {

    return (
      <div className="ms-wrapper container-fluid">
        <h4>It will be generated in the first week of the month.</h4>
      </div>
    );

  }

  return (

    <div className="ms-wrapper container-fluid">

      <div className="ms-header">
        <h4>📊 Monthly Work Summary</h4>
        <p>Auto-generated from daily SEO activities</p>
      </div>

      <div className="ms-card">

        <h5>{summary.month} Performance</h5>

        <p>
          In this month, SEO activities were performed on{" "}
          <strong>{summary.totalDays}</strong> days.
        </p>

        <ul>
          <li>✅ On Page Tasks: {summary.onPageCount}</li>
          <li>⚙️ Technical Tasks: {summary.technicalCount}</li>
          <li>🔗 Off Page Tasks: {summary.offPageCount}</li>
        </ul>

        <p className="mt-3 text-muted">
          This report is automatically generated based on daily work logs.
        </p>

      </div>

    </div>

  );

};

export default MonthlySummary;
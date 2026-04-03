import "../styles/monthlySummary.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MonthlySummary = () => {

  const { clientId } = useParams();
  const [summary, setSummary] = useState(null);

  /* ================= GET LAST MONTH ================= */

  const getLastMonth = () => {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    return now.toISOString().slice(0, 7); // YYYY-MM
  };

  /* ================= LOAD DATA ================= */

  useEffect(() => {

    const loadSummary = async () => {

      try {

        const res = await fetch(
          `https://digigrowth.digital/worklog-history/${clientId}`
        );

        const data = await res.json();

        const lastMonth = getLastMonth();

        console.log("LAST MONTH:", lastMonth);

        /* ================= FILTER LAST MONTH ================= */

        const monthlyLogs = data.filter(log => {
          if (!log.date) return false;
          return log.date.slice(0, 7) === lastMonth;
        });

        /* ================= REMOVE DUPLICATE DAYS ================= */

        const uniqueDays = new Map();

        monthlyLogs.forEach(log => {
          uniqueDays.set(log.date, log);
        });

        const finalLogs = Array.from(uniqueDays.values());

        console.log("FINAL LOGS:", finalLogs);

        if (finalLogs.length === 0) {
          setSummary(null);
          return;
        }

        /* ================= COUNT TASKS ================= */

        let onPageCount = 0;
        let technicalCount = 0;
        let offPageCount = 0;

        finalLogs.forEach(log => {
          onPageCount += log.onPage?.length || 0;
          technicalCount += log.technical?.length || 0;
          offPageCount += log.offPage?.length || 0;
        });

        /* ================= SET SUMMARY ================= */

        setSummary({
          month: lastMonth,
          onPageCount,
          technicalCount,
          offPageCount,
          totalDays: finalLogs.length
        });

      } catch (err) {

        console.log("Summary Error:", err);

      }

    };

    loadSummary();

  }, [clientId]);

  /* ================= UI ================= */

  if (!summary) {
    return (
      <div className="ms-wrapper container-fluid">
        <h4>No data available for last month.</h4>
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
          SEO work was performed on{" "}
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
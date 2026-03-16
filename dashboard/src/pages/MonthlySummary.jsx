import "../styles/monthlySummary.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const MonthlySummary = () => {

  const { clientId } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {

    try {

      const res = await fetch(
  `https://seo-dashboard-production-ec44.up.railway.app/seo/search-console?clientId=${clientId}&range=${range}`
);

      setReport(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  if (!report) {

    return (
      <div className="ms-wrapper container-fluid">
        <h4>No monthly report available yet.</h4>
      </div>
    );

  }

  return (

    <div className="ms-wrapper container-fluid">

      {/* HEADER */}

      <div className="ms-header">

        <div>
          <h4>Monthly Summary</h4>
          <p>Executive overview of this month's performance.</p>
        </div>

      </div>


      {/* SUMMARY CARD */}

      <div className="ms-card">

        <h5>{report.month} Performance Review</h5>

        <p>{report.summary}</p>

        <p>
          Organic traffic increased by{" "}
          <strong>{report.trafficGrowth}</strong>, primarily driven by{" "}
          <strong>{report.focusKeyword}</strong>.
        </p>


        {/* AUTHOR */}

        <div className="ms-author">

          <div className="ms-avatar">
            {report.author?.substring(0, 2)}
          </div>

          <div>

            <strong>{report.author}</strong>

            <small>{report.role}</small>

          </div>

        </div>

      </div>

    </div>

  );

};

export default MonthlySummary;
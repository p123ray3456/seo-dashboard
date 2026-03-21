import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/workLog.css";

const API = "https://seo-dashboard-production-ec44.up.railway.app";

const WorkLog = () => {

  const { clientId } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {

    const loadWorkLog = async () => {

      try {

        const res = await fetch(
          `${API}/worklog-history/${clientId}`
        );

        const result = await res.json();

        setData(result);

      } catch (error) {
        console.error("WorkLog error:", error);
      }

    };

    loadWorkLog();

  }, [clientId]);

  if (!data || data.length === 0) {
    return (
      <div className="wl-wrapper container-fluid">
        No work data available
      </div>
    );
  }

  return (

    <div className="wl-wrapper container-fluid">

      {/* HEADER */}
      <div className="wl-header">
        <div>
          <h4>SEO Work Activity</h4>
          <p>Daily tasks performed by our team</p>
        </div>
      </div>

      {/* LOOP DATE WISE */}
      {data.map((day, index) => (

        <div key={index} className="mb-4">

          {/* DATE */}
          <h6 className="fw-bold mb-2">
            📅 {formatDate(day.date)}
          </h6>

          {/* GRID */}
          <div className="wl-grid">

            <TaskSection
              title="On Page Optimization"
              tasks={day.onPage}
            />

            <TaskSection
              title="Technical SEO"
              tasks={day.technical}
            />

            <TaskSection
              title="Off Page SEO"
              tasks={day.offPage}
            />

          </div>

        </div>

      ))}

    </div>

  );

};


/* ================= TASK SECTION ================= */

const TaskSection = ({ title, tasks }) => (

  <div className="wl-card">

    <h6>{title}</h6>

    {(tasks || []).length === 0 ? (

      <p className="text-muted">No tasks added</p>

    ) : (

      <ul>

        {tasks.map((task, i) => (

          <li className="wl-item" key={i}>

            <div className="wl-dot done"></div>

            <p>{task}</p> {/* ✅ FIXED HERE */}

          </li>

        ))}

      </ul>

    )}

  </div>

);

export default WorkLog;


/* ================= UTIL ================= */

function formatDate(dateString){
  const d = new Date(dateString);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
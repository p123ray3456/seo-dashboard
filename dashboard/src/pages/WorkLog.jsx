import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/workLog.css";

const WorkLog = () => {

  const { clientId } = useParams();

  const [data, setData] = useState(null);

  const month = new Date().toISOString().slice(0, 7);

  useEffect(() => {

    const loadWorkLog = async () => {

      try {

        const res = await fetch(
          `https://seo-dashboard-production-ec44.up.railway.app/seo/work-log?clientId=${clientId}&month=${month}`
        );

        const result = await res.json();

        setData(result);

      } catch (error) {

        console.error("WorkLog error:", error);

      }

    };

    loadWorkLog();

  }, [clientId]);

  if (!data) {
    return <div className="wl-wrapper container-fluid">Loading...</div>;
  }

  const logs = data.logs || {
    onPage: [],
    technical: [],
    offPage: [],
  };

  return (

    <div className="wl-wrapper container-fluid">

      {/* HEADER */}

      <div className="wl-header">

        <div>
          <h4>SEO Work Log</h4>
          <p>Tasks completed this month</p>
        </div>

      </div>


      {/* STATUS */}

      <div className="wl-status-box">

        <div>
          <h6>Monthly Status</h6>
          <p>{data.status || "No Status"}</p>
        </div>

        <div>
          <h6>Technical Health</h6>
          <p>{data.health || 0}%</p>
        </div>

      </div>


      {/* TASK GRID */}

      <div className="wl-grid">

        <TaskSection
          title="On Page Optimization"
          tasks={logs.onPage}
        />

        <TaskSection
          title="Technical SEO"
          tasks={logs.technical}
        />

        <TaskSection
          title="Off Page SEO"
          tasks={logs.offPage}
        />

      </div>

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

            <p>{task?.text || "-"}</p>

          </li>

        ))}

      </ul>

    )}

  </div>

);

export default WorkLog;
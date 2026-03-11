import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/worklog.css";

const WorkLog = () => {

  const { clientId } = useParams();

  const [data, setData] = useState(null);

  const month = new Date().toISOString().slice(0, 7);

  useEffect(() => {

    const loadWorkLog = async () => {

      try {

        const res = await fetch(
          `http://localhost:5000/seo/work-log?clientId=${clientId}&month=${month}`
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
    return <div className="worklog-wrapper">Loading...</div>;
  }

  const logs = data.logs || {
    onPage: [],
    technical: [],
    offPage: [],
  };

  return (

    <div className="worklog-wrapper">

      <div className="worklog-header">
        <h4>SEO Work Log</h4>
        <p>Tasks completed this month</p>
      </div>

      <div className="worklog-status">

        <div className="status-card">
          <small>Monthly Status</small>
          <h5>{data.status || "No Status"}</h5>
        </div>

        <div className="status-card">
          <small>Technical Health</small>
          <h5>{data.health || 0}%</h5>
        </div>

      </div>

      {/* ON PAGE TASKS */}

      <TaskSection
        title="On Page Optimization"
        tasks={logs.onPage}
      />

      {/* TECHNICAL TASKS */}

      <TaskSection
        title="Technical SEO"
        tasks={logs.technical}
      />

      {/* OFF PAGE TASKS */}

      <TaskSection
        title="Off Page SEO"
        tasks={logs.offPage}
      />

    </div>

  );

};


/* ================= TASK SECTION ================= */

const TaskSection = ({ title, tasks }) => (

  <div className="worklog-section">

    <h6>{title}</h6>

    {(tasks || []).length === 0 ? (
      <p className="text-muted">No tasks added</p>
    ) : (

      <ul>

        {tasks.map((task, i) => (

          <li key={i}>
            {task?.text || "-"}
          </li>

        ))}

      </ul>

    )}

  </div>

);

export default WorkLog;
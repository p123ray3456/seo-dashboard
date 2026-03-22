import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/workLog.css";

const WorkLog = () => {

  const { clientId } = useParams();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadLogs();
  }, [clientId]);

  const loadLogs = async () => {

    try {

      const res = await fetch(
        `https://seo-dashboard-production-ec44.up.railway.app/worklog-history/${clientId}`
      );

      const data = await res.json();

      setLogs(data);

    } catch (err) {
      console.log("Error:", err);
    }

  };

  if (!logs.length) {
    return (
      <div className="wl-wrapper container-fluid">
        <h5>No work logs available</h5>
      </div>
    );
  }

  return (

    <div className="wl-wrapper container-fluid">

      <h4 className="mb-3">📅 Daily Work Reports</h4>

      {logs.map((day, index) => (

        <div key={index} className="wl-card mb-3 p-3 shadow-sm">

          <h6 className="fw-bold mb-2">Date: {day.date}</h6>

          <TaskSection title="On Page" tasks={day.onPage} />
          <TaskSection title="Technical" tasks={day.technical} />
          <TaskSection title="Off Page" tasks={day.offPage} />

        </div>

      ))}

    </div>

  );

};

const TaskSection = ({ title, tasks }) => (

  <div className="mb-2">

    <strong>{title}</strong>

    {(tasks || []).length === 0 ? (
      <p className="text-muted">No tasks</p>
    ) : (
      <ul>
        {tasks.map((t, i) => (
          <li key={i}>✅ {t}</li>
        ))}
      </ul>
    )}

  </div>

);

export default WorkLog;
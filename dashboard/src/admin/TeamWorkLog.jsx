import { useEffect, useState } from "react";
import "./styles/teamWorklog.css";

const API = "https://seo-dashboard-production-ec44.up.railway.app";

const TeamWorkLog = () => {

  const today = new Date().toISOString().split("T")[0];

  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");

  const [logs, setLogs] = useState({
    onPage: [],
    technical: [],
    offPage: [],
  });

  const [customTasks, setCustomTasks] = useState({
    onPage: [],
    technical: [],
    offPage: [],
  });

  const [newTask, setNewTask] = useState({
    onPage: "",
    technical: "",
    offPage: "",
  });

  const checklist = {
    onPage: ["Meta tags optimized","Content updated"],
    technical: ["Sitemap updated","Mobile optimization"],
    offPage: ["Backlinks created","Guest posting"]
  };

  /* ================= LOAD CLIENTS ================= */

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const res = await fetch(`${API}/clients`);
    const data = await res.json();

    setClients(data);

    if (data.length > 0) {
      setClientId(data[0].id);
    }
  };

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (clientId) loadData();
  }, [clientId]);

  const loadData = async () => {

    const res = await fetch(`${API}/worklog/${clientId}?date=${today}`);
    const data = await res.json();

    setLogs({
      onPage: data.onPage || [],
      technical: data.technical || [],
      offPage: data.offPage || [],
    });

    setCustomTasks({
      onPage: data.customOnPage || [],
      technical: data.customTechnical || [],
      offPage: data.customOffPage || [],
    });

  };

  /* ================= TOGGLE ================= */

  const toggle = (type, task) => {

    setLogs(prev => {

      const exists = prev[type].includes(task);

      return {
        ...prev,
        [type]: exists
          ? prev[type].filter(t => t !== task)
          : [...prev[type], task]
      };

    });

  };

  /* ================= ADD CUSTOM TASK ================= */

  const addTask = (type) => {

    if (!newTask[type].trim()) return;

    setCustomTasks(prev => ({
      ...prev,
      [type]: [...prev[type], newTask[type]]
    }));

    setLogs(prev => ({
      ...prev,
      [type]: [...prev[type], newTask[type]]
    }));

    setNewTask(prev => ({
      ...prev,
      [type]: ""
    }));

  };

  /* ================= SAVE ================= */

  const save = async () => {

    await fetch(`${API}/worklog`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        date: today,
        onPage: logs.onPage,
        technical: logs.technical,
        offPage: logs.offPage,
        customOnPage: customTasks.onPage,
        customTechnical: customTasks.technical,
        customOffPage: customTasks.offPage
      })
    });

    alert("✅ Work Saved");

  };

  /* ================= UI ================= */
return (

  <div className="tw-wrapper">

    <div className="tw-card">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="tw-title">Daily Work</h4>
        <span className="tw-date">{today}</span>
      </div>

      {/* CLIENT SELECT */}
      <select
        className="form-control tw-select mb-3"
        value={clientId}
        onChange={(e)=>setClientId(e.target.value)}
      >
        {clients.map(client => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>

      {["onPage","technical","offPage"].map(section => (

        <div key={section} className="tw-section">

          <h6 className="text-capitalize">{section}</h6>

          {[...checklist[section], ...customTasks[section]].map(task => (

            <div key={task} className="tw-task">

              <input
                type="checkbox"
                checked={logs[section].includes(task)}
                onChange={() => toggle(section, task)}
              />

              <label>{task}</label>

            </div>

          ))}

          {/* ADD TASK */}
          <div className="tw-add">

            <input
              type="text"
              className="form-control"
              placeholder={`Add ${section} task`}
              value={newTask[section]}
              onChange={(e)=>
                setNewTask({...newTask,[section]:e.target.value})
              }
            />

            <button
              className="btn btn-success"
              onClick={()=>addTask(section)}
            >
              + Add
            </button>

          </div>

        </div>

      ))}

      <button className="btn btn-primary tw-save" onClick={save}>
        Save Work
      </button>

    </div>

  </div>

);

};

export default TeamWorkLog;
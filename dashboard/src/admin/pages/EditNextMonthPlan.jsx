import { useState, useEffect } from "react";
import axios from "axios";

const EditNextMonthPlan = () => {

  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [month, setMonth] = useState("");
  const [tasks, setTasks] = useState([""]);

  const [showReminder, setShowReminder] = useState(false);

  /* ================= CHECK LAST 10 DAYS ================= */

  useEffect(() => {

    const today = new Date();

    const lastDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();

    if (today.getDate() >= lastDate - 9) {
      setShowReminder(true);
    }

    loadClients();

  }, []);

  /* ================= LOAD CLIENTS ================= */

  const loadClients = async () => {

    const res = await axios.get(
      "https://seo-dashboard-production-ec44.up.railway.app/clients"
    );

    setClients(res.data);

  };

  /* ================= TASK HANDLING ================= */

  const addTask = () => {
    setTasks([...tasks, ""]);
  };

  const updateTask = (value, index) => {

    const updated = [...tasks];
    updated[index] = value;

    setTasks(updated);

  };

  /* ================= SAVE ================= */

  const savePlan = async () => {

    const roadmap = tasks.map(task => ({
      title: task,
      status: "Planned"
    }));

    await axios.post(
      "https://digigrowth.digital/next-month-plan",
      {
        clientId,
        month,
        roadmap
      }
    );

    alert("Plan saved");

  };

  /* ================= UI ================= */

  return (

    <div className="container">

      {/* 🔥 CLEAN REMINDER */}
      {showReminder && (
        <div className="reminder-box">

          <div className="reminder-left">
            ⚠️ <strong>Last days of month</strong>
            <span>Please create next month plan</span>
          </div>

          <div className="reminder-tag">
            Important
          </div>

        </div>
      )}

      <h3 className="mb-4">Edit Next Month Plan</h3>

      {/* CLIENT */}
      <select
        className="form-control mb-3"
        onChange={(e)=>setClientId(e.target.value)}
      >
        <option>Select Client</option>

        {clients.map(client => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>

      {/* MONTH */}
      <input
        className="form-control mb-3"
        placeholder="Month (Example: April 2026)"
        onChange={(e)=>setMonth(e.target.value)}
      />

      {/* TASKS */}
      {tasks.map((task,index)=>(
        <input
          key={index}
          className="form-control mb-2"
          placeholder="Plan Task"
          onChange={(e)=>updateTask(e.target.value,index)}
        />
      ))}

      <button className="btn btn-secondary me-2" onClick={addTask}>
        Add Task
      </button>

      <button className="btn btn-primary" onClick={savePlan}>
        Save Plan
      </button>

      {/* ================= STYLES ================= */}
      <style>{`

/* REMINDER BOX */
.reminder-box{
  background: #fef9c3;
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 18px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* LEFT TEXT */
.reminder-left{
  display: flex;
  flex-direction: column;
  font-size: 13px;
}

.reminder-left strong{
  color: #92400e;
  font-size: 14px;
}

.reminder-left span{
  color: #78350f;
}

/* TAG */
.reminder-tag{
  background: #111827;
  color: white;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 8px;
}

/* MOBILE */
@media (max-width:768px){

.reminder-box{
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.reminder-tag{
  align-self: flex-end;
}

}

      `}</style>

    </div>

  );

};

export default EditNextMonthPlan;
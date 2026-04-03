import { useState, useEffect } from "react";

const API = "https://digigrowth.digital";

const TeamPlan = () => {

  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");

  const [month, setMonth] = useState("");
  const [tasks, setTasks] = useState([""]);

  /* ================= LOAD CLIENTS ================= */

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {

      const res = await fetch(`${API}/clients`);
      const data = await res.json();

      setClients(data);

      if (data.length > 0) {
        setClientId(data[0].id); // default first client
      }

    } catch (err) {
      console.log("Client load error", err);
    }
  };

  /* ================= ADD TASK ================= */

  const addTask = () => {
    setTasks([...tasks, ""]);
  };

  const updateTask = (value, index) => {
    const updated = [...tasks];
    updated[index] = value;
    setTasks(updated);
  };

  /* ================= SAVE PLAN ================= */

  const savePlan = async () => {

    if (!clientId) {
      alert("Please select client");
      return;
    }

    if (!month) {
      alert("Please enter month");
      return;
    }

    const roadmap = tasks
      .filter(task => task.trim() !== "")
      .map(task => ({
        title: task,
        status: "Planned"
      }));

    if (roadmap.length === 0) {
      alert("Please add at least one task");
      return;
    }

    try {

      await fetch(`${API}/next-month-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          month,
          roadmap
        })
      });

      alert("✅ Plan Saved Successfully");

      setTasks([""]); // reset

    } catch (err) {
      console.log(err);
      alert("❌ Failed to save plan");
    }

  };

  /* ================= UI ================= */

  return (

    <div className="container">

      <h4 className="mb-3">Next Month Plan</h4>

      {/* 🔥 CLIENT DROPDOWN */}
      <select
        className="form-control mb-3"
        value={clientId}
        onChange={(e)=>setClientId(e.target.value)}
      >

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
        value={month}
        onChange={(e)=>setMonth(e.target.value)}
      />

      {/* TASKS */}
      {tasks.map((task,index)=>(
        <input
          key={index}
          className="form-control mb-2"
          placeholder="Task"
          value={task}
          onChange={(e)=>updateTask(e.target.value,index)}
        />
      ))}

      <button className="btn btn-secondary me-2" onClick={addTask}>
        + Add Task
      </button>

      <button className="btn btn-primary" onClick={savePlan}>
        Save Plan
      </button>

    </div>

  );

};

export default TeamPlan;
import { useState,useEffect } from "react";
import axios from "axios";

const EditNextMonthPlan = () => {

 const [clients,setClients] = useState([]);
 const [clientId,setClientId] = useState("");
 const [month,setMonth] = useState("");

 const [tasks,setTasks] = useState([""]);

 useEffect(()=>{
  loadClients();
 },[]);

 const loadClients = async () => {

  const res = await axios.get("https://seo-dashboard-production-ec44.up.railway.app/clients");
  setClients(res.data);

 };

 const addTask = () => {
  setTasks([...tasks,""]);
 };

 const updateTask = (value,index) => {

  const updated=[...tasks];
  updated[index]=value;

  setTasks(updated);

 };

 const savePlan = async () => {

  const roadmap = tasks.map(task=>({
   title:task,
   status:"Planned"
  }));

  await axios.post("http://localhost:5000/next-month-plan",{

   clientId,
   month,
   roadmap

  });

  alert("Plan saved");

 };

 return(

  <div className="container">

   <h3 className="mb-4">Edit Next Month Plan</h3>

   <select
    className="form-control mb-3"
    onChange={(e)=>setClientId(e.target.value)}
   >

    <option>Select Client</option>

    {clients.map(client=>(
      <option key={client.id} value={client.id}>
        {client.name}
      </option>
    ))}

   </select>

   <input
    className="form-control mb-3"
    placeholder="Month"
    onChange={(e)=>setMonth(e.target.value)}
   />

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

  </div>

 );

};

export default EditNextMonthPlan;
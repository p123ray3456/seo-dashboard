import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

/* =====================================================
   MAIN COMPONENT
===================================================== */

const ClientAdminSettings = () => {

  const { clientId } = useParams();

  const [tab,setTab] = useState("worklog");

  return (

    <div className="container-fluid">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Manage Client Settings</h4>
        <small className="text-muted">Client ID: {clientId}</small>
      </div>

      {/* TABS */}

      <div className="mb-3">

        <button
          className={`btn me-2 ${tab==="worklog"?"btn-primary":"btn-outline-primary"}`}
          onClick={()=>setTab("worklog")}
        >
          Work Log Manager
        </button>

        <button
          className={`btn ${tab==="leads"?"btn-primary":"btn-outline-primary"}`}
          onClick={()=>setTab("leads")}
        >
          Leads Manager
        </button>

      </div>

      {tab==="worklog" && <WorkLogManager clientId={clientId}/>}

      {tab==="leads" && <LeadsManager clientId={clientId}/>}

    </div>

  );

};

export default ClientAdminSettings;



/* =====================================================
   WORK LOG MANAGER
===================================================== */

const WorkLogManager = ({ clientId }) => {

  const [month, setMonth] = useState(getCurrentMonth());
  const [status, setStatus] = useState("");
  const [health, setHealth] = useState(100);

  const [logs, setLogs] = useState({
    onPage: [],
    technical: [],
    offPage: [],
  });

  useEffect(() => {
    if (clientId) loadData();
  }, [month, clientId]);

  const loadData = async () => {

    try {

      const res = await fetch(
        `https://seo-dashboard-production-ec44.up.railway.app/seo/work-log?clientId=${clientId}&month=${month}`
      );

      const data = await res.json();

      setStatus(data?.status || "");
      setHealth(data?.health || 0);

      setLogs({
        onPage: data?.logs?.onPage || [],
        technical: data?.logs?.technical || [],
        offPage: data?.logs?.offPage || [],
      });

    } catch (error) {
      console.error("WorkLog Load Error:", error);
    }

  };

  const handleAddTask = (type) => {

    setLogs(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), { text: "" }]
    }));

  };

  const handleChange = (type,index,value) => {

    setLogs(prev => {

      const updated = { ...prev };

      if (!updated[type]) updated[type] = [];

      if (!updated[type][index]) updated[type][index] = { text: "" };

      updated[type][index] = {
        ...updated[type][index],
        text:value
      };

      return updated;

    });

  };

  const saveWorkLog = async () => {

    await fetch("http://localhost:5000/seo/work-log",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        clientId,
        month,
        status,
        health,
        logs
      })

    });

    alert("Work Log Saved Successfully!");

  };

  return(

    <div className="card p-4 shadow-sm">

      <h5 className="fw-bold mb-3">Work Log Manager</h5>

      <div className="mb-3">
        <label>Month</label>
        <input
          type="month"
          className="form-control"
          value={month}
          onChange={(e)=>setMonth(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Monthly Status</label>
        <input
          className="form-control"
          value={status}
          onChange={(e)=>setStatus(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Technical Health (%)</label>
        <input
          type="number"
          className="form-control"
          value={health}
          onChange={(e)=>setHealth(Number(e.target.value))}
        />
      </div>

      <hr/>

      {["onPage","technical","offPage"].map(section=>(
        <div key={section} className="mb-4">

          <h6 className="fw-bold text-capitalize">
            {section} Tasks
          </h6>

          {(logs[section]||[]).map((task,i)=>(
            <input
              key={i}
              className="form-control mb-2"
              value={task?.text||""}
              onChange={(e)=>handleChange(section,i,e.target.value)}
            />
          ))}

          <button
            className="btn btn-sm btn-outline-primary"
            onClick={()=>handleAddTask(section)}
          >
            + Add Task
          </button>

        </div>
      ))}

      <button
        className="btn btn-primary mt-3"
        onClick={saveWorkLog}
      >
        Save Work Log
      </button>

    </div>

  );

};



/* =====================================================
   LEADS MANAGER
===================================================== */

const LeadsManager = ({clientId}) => {

  const [month,setMonth] = useState(getCurrentMonth());
  const [totalLeads,setTotalLeads] = useState(0);
  const [converted,setConverted] = useState(0);

  const [sources,setSources] = useState([
    {source:"Organic",leads:0},
    {source:"Google Ads",leads:0},
    {source:"Referral",leads:0}
  ]);

  const saveLeads = async () => {

    await fetch("http://localhost:5000/seo/leads",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        clientId,
        month,
        totalLeads,
        converted,
        sourceBreakdown:sources
      })

    });

    alert("Leads Saved");

  };

  return(

    <div className="card p-4 shadow-sm">

      <h5 className="fw-bold mb-3">Leads Manager</h5>

      <div className="mb-3">
        <label>Month</label>
        <input
          type="month"
          className="form-control"
          value={month}
          onChange={(e)=>setMonth(e.target.value)}
        />
      </div>

      <div className="row">

        <div className="col-md-6">
          <label>Total Leads</label>
          <input
            type="number"
            className="form-control"
            value={totalLeads}
            onChange={(e)=>setTotalLeads(Number(e.target.value))}
          />
        </div>

        <div className="col-md-6">
          <label>Converted Leads</label>
          <input
            type="number"
            className="form-control"
            value={converted}
            onChange={(e)=>setConverted(Number(e.target.value))}
          />
        </div>

      </div>

      <hr/>

      <h6>Source Breakdown</h6>

      {sources.map((src,i)=>(
        <div key={i} className="mb-2">

          <label>{src.source}</label>

          <input
            type="number"
            className="form-control"
            value={src.leads}
            onChange={(e)=>{

              const updated=[...sources];
              updated[i].leads=Number(e.target.value);
              setSources(updated);

            }}
          />

        </div>
      ))}

      <button
        className="btn btn-primary mt-3"
        onClick={saveLeads}
      >
        Save Leads
      </button>

    </div>

  );

};



/* =====================================================
   UTIL
===================================================== */

function getCurrentMonth(){

  const date=new Date();

  return date.toISOString().slice(0,7);

}
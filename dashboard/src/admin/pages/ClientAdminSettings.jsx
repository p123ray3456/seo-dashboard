import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const API = "https://seo-dashboard-production-ec44.up.railway.app"; 

/* =====================================================
   MAIN COMPONENT
===================================================== */

const ClientAdminSettings = () => {

  const { clientId } = useParams();
  const [tab, setTab] = useState("worklog");

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
   WORK LOG MANAGER (FIXED)
===================================================== */

const WorkLogManager = ({ clientId }) => {

  const [date, setDate] = useState(getToday());

  const [logs, setLogs] = useState({
    onPage: [],
    technical: [],
    offPage: [],
  });

  const [loading, setLoading] = useState(false);

  /* ================= CHECKLIST ================= */

  const checklist = {
    onPage: [
      "Meta tags optimized",
      "Content updated",
      "Internal linking",
      "Keyword optimization"
    ],
    technical: [
      "Sitemap updated",
      "Page speed improved",
      "Mobile optimization",
      "Schema implemented"
    ],
    offPage: [
      "Backlinks created",
      "Directory submission",
      "Guest posting",
      "Social bookmarking"
    ]
  };

  /* ================= LOAD ================= */

  useEffect(() => {
    if (clientId) loadData();
  }, [clientId, date]);

  const loadData = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        `${API}/worklog/${clientId}?date=${date}`
      );

      const data = await res.json();

      setLogs({
        onPage: data?.onPage || [],
        technical: data?.technical || [],
        offPage: data?.offPage || [],
      });

    } catch (err) {
      console.log("Load Error", err);
    } finally {
      setLoading(false);
    }

  };

  /* ================= CHECKBOX ================= */

  const handleCheckbox = (type, task) => {

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

  /* ================= SAVE ================= */

  const saveWorkLog = async () => {

    try {

      const res = await fetch(`${API}/worklog`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          clientId: String(clientId),
          date: date, // ✅ correct format YYYY-MM-DD
          onPage: logs.onPage,
          technical: logs.technical,
          offPage: logs.offPage
        })

      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Save failed");
      }

      alert("✅ Daily Work Saved Successfully");

    } catch (err) {

      console.log("SAVE ERROR:", err);
      alert("❌ Error saving work log");

    }

  };

  /* ================= UI ================= */

  if (loading) return <div>Loading...</div>;

  return(

    <div className="card p-4 shadow-sm">

      <h5 className="fw-bold mb-3">📅 Daily Work Checklist</h5>

      {/* DATE */}
      <div className="mb-3">
        <label>Select Date</label>

        <input
          type="date"
          className="form-control"
          value={date}
          onChange={(e)=>setDate(e.target.value)}
        />
      </div>

      <hr/>

      {["onPage","technical","offPage"].map(section=>(

        <div key={section} className="mb-4">

          <h6 className="fw-bold text-capitalize">
            {section} Tasks
          </h6>

          <div className="row">

            {checklist[section].map((task,i)=>(

              <div key={i} className="col-md-6">

                <div className="form-check mb-2">

                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={logs[section].includes(task)}
                    onChange={()=>handleCheckbox(section,task)}
                  />

                  <label className="form-check-label">
                    {task}
                  </label>

                </div>

              </div>

            ))}

          </div>

        </div>

      ))}

      <button
        className="btn btn-primary mt-3 w-100"
        onClick={saveWorkLog}
      >
        Save Daily Work
      </button>

    </div>

  );

};



/* =====================================================
   LEADS MANAGER (UNCHANGED)
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

    await fetch(`${API}/seo/leads`,{

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
  return new Date().toISOString().slice(0,7);
}

function getToday(){
  return new Date().toISOString().split("T")[0];
}
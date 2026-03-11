import { useEffect, useState } from "react";
import axios from "axios";

const EditMonthlySummary = () => {

  const [clients,setClients] = useState([]);
  const [clientId,setClientId] = useState("");

  const [month,setMonth] = useState("");
  const [summary,setSummary] = useState("");
  const [trafficGrowth,setTrafficGrowth] = useState("");
  const [focusKeyword,setFocusKeyword] = useState("");

  useEffect(()=>{
    loadClients();
  },[]);

  const loadClients = async () => {

    const res = await axios.get("http://localhost:5000/clients");

    setClients(res.data);

  };

  const saveReport = async () => {

    if(!clientId){
      alert("Please select client");
      return;
    }

    await axios.post("http://localhost:5000/monthly-summary",{

      clientId,
      month,
      summary,
      trafficGrowth,
      focusKeyword,
      author:"Priyanshu Kumar Singh",
      role:"SEO Strategist"

    });

    alert("Monthly Summary Saved");

  };

  return(

    <div className="container">

      <h3 className="mb-4">Edit Monthly Summary</h3>

      {/* CLIENT SELECT */}

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
        placeholder="Month (Example: March 2026)"
        onChange={(e)=>setMonth(e.target.value)}
      />

      <textarea
        className="form-control mb-3"
        placeholder="Monthly Summary"
        rows="4"
        onChange={(e)=>setSummary(e.target.value)}
      />

      <input
        className="form-control mb-3"
        placeholder="Traffic Growth (Example: 18%)"
        onChange={(e)=>setTrafficGrowth(e.target.value)}
      />

      <input
        className="form-control mb-3"
        placeholder="Focus Keyword"
        onChange={(e)=>setFocusKeyword(e.target.value)}
      />

      <button className="btn btn-primary" onClick={saveReport}>
        Save Monthly Summary
      </button>

    </div>

  );

};

export default EditMonthlySummary;
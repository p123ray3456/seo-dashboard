import { useEffect, useState } from "react";
import axios from "axios";

const EditMonthlySummary = () => {

  const [clients, setClients] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const [clientId, setClientId] = useState("");

  const [month, setMonth] = useState("");
  const [summary, setSummary] = useState("");
  const [trafficGrowth, setTrafficGrowth] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");

  const [authorId, setAuthorId] = useState("");

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadClients();
    loadTeamMembers();
  }, []);

  const loadClients = async () => {
    try {

      const res = await axios.get(
        "https://seo-dashboard-production-ec44.up.railway.app/clients"
      );

      setClients(res.data);

    } catch (error) {
      console.log("Client load error", error);
    }
  };

  const loadTeamMembers = async () => {
    try {

      const res = await axios.get(
        "https://seo-dashboard-production-ec44.up.railway.app/team-members"
      );

      setTeamMembers(res.data);

    } catch (error) {
      console.log("Team member load error", error);
    }
  };

  /* ================= SAVE REPORT ================= */

  const saveReport = async () => {

    if (!clientId) {
      alert("Please select client");
      return;
    }

    if (!authorId) {
      alert("Please select report author");
      return;
    }

    const author = teamMembers.find(
      (m) => m._id === authorId
    );

    try {

      await axios.post(
        "https://seo-dashboard-production-ec44.up.railway.app/monthly-summary",
        {
          clientId,
          month,
          summary,
          trafficGrowth,
          focusKeyword,

          author: author.name,
          role: author.role,
        }
      );

      alert("Monthly Summary Saved");

    } catch (error) {

      console.log("Save report error", error);

      alert("Failed to save summary");

    }

  };

  return (

    <div className="container">

      <h3 className="mb-4">Edit Monthly Summary</h3>

      {/* CLIENT SELECT */}

      <select
        className="form-control mb-3"
        onChange={(e) => setClientId(e.target.value)}
      >

        <option>Select Client</option>

        {clients.map((client) => (

          <option key={client.id} value={client.id}>
            {client.name}
          </option>

        ))}

      </select>


      {/* AUTHOR SELECT */}

      <select
        className="form-control mb-3"
        onChange={(e) => setAuthorId(e.target.value)}
      >

        <option>Select Report Author</option>

        {teamMembers.map((member) => (

          <option key={member._id} value={member._id}>
            {member.name} — {member.role}
          </option>

        ))}

      </select>


      {/* MONTH */}

      <input
        className="form-control mb-3"
        placeholder="Month (Example: March 2026)"
        onChange={(e) => setMonth(e.target.value)}
      />


      {/* SUMMARY */}

      <textarea
        className="form-control mb-3"
        placeholder="Monthly Summary"
        rows="4"
        onChange={(e) => setSummary(e.target.value)}
      />


      {/* TRAFFIC GROWTH */}

      <input
        className="form-control mb-3"
        placeholder="Traffic Growth (Example: 18%)"
        onChange={(e) => setTrafficGrowth(e.target.value)}
      />


      {/* FOCUS KEYWORD */}

      <input
        className="form-control mb-3"
        placeholder="Focus Keyword"
        onChange={(e) => setFocusKeyword(e.target.value)}
      />


      {/* SAVE BUTTON */}

      <button
        className="btn btn-primary"
        onClick={saveReport}
      >
        Save Monthly Summary
      </button>

    </div>

  );

};

export default EditMonthlySummary;  
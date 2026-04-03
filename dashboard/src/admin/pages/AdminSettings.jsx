import { useState, useEffect } from "react";
import axios from "axios";

const AdminSettings = () => {

  const [agencyName,setAgencyName] = useState("");
  const [email,setEmail] = useState("");

  const [notifyReport,setNotifyReport] = useState(true);
  const [notifyLead,setNotifyLead] = useState(true);

  useEffect(()=>{
    loadSettings();
  },[]);

  const loadSettings = async () => {

    const res = await axios.get("https://seo-dashboard-production-ec44.up.railway.app/admin/settings");

    if(res.data){

      setAgencyName(res.data.agencyName || "");
      setEmail(res.data.email || "");
      setNotifyReport(res.data.notifyReport);
      setNotifyLead(res.data.notifyLead);

    }

  };

  const saveSettings = async () => {

    await axios.post("https://digigrowth.digital/admin/settings",{

      agencyName,
      email,
      notifyReport,
      notifyLead

    });

    alert("Settings saved successfully");

  };

  return (

    <div className="container-fluid">

      {/* HEADER */}

      <div className="mb-4">
        <h4 className="fw-bold mb-1">Agency Settings</h4>
        <p className="text-muted mb-0">
          Configure your agency dashboard preferences.
        </p>
      </div>

      {/* GENERAL INFO */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body">

          <h6 className="fw-bold mb-3">
            <i className="bi bi-building me-2"></i>
            General Information
          </h6>

          <div className="row">

            <div className="col-md-6 mb-3">

              <label className="form-label">Agency Name</label>

              <input
                type="text"
                className="form-control"
                value={agencyName}
                onChange={(e)=>setAgencyName(e.target.value)}
              />

            </div>

            <div className="col-md-6 mb-3">

              <label className="form-label">Support Email</label>

              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />

            </div>

          </div>

        </div>

      </div>

      {/* NOTIFICATIONS */}

      <div className="card border-0 shadow-sm mb-4">

        <div className="card-body">

          <h6 className="fw-bold mb-3">
            <i className="bi bi-bell me-2"></i>
            Notifications
          </h6>

          <div className="form-check mb-2">

            <input
              type="checkbox"
              className="form-check-input"
              checked={notifyReport}
              onChange={()=>setNotifyReport(!notifyReport)}
            />

            <label className="form-check-label">
              Email when client report is generated
            </label>

          </div>

          <div className="form-check">

            <input
              type="checkbox"
              className="form-check-input"
              checked={notifyLead}
              onChange={()=>setNotifyLead(!notifyLead)}
            />

            <label className="form-check-label">
              Email when new lead is captured
            </label>

          </div>

        </div>

      </div>

      {/* SECURITY */}

      <div className="card border-0 shadow-sm mb-4 opacity-75">

        <div className="card-body">

          <h6 className="fw-bold mb-2">
            <i className="bi bi-lock me-2"></i>
            Security (Coming Soon)
          </h6>

          <p className="text-muted mb-0">
            Two-factor authentication and SSO settings will be available in the Pro plan.
          </p>

        </div>

      </div>

      {/* SAVE */}

      <button className="btn btn-primary" onClick={saveSettings}>
        Save Settings
      </button>

    </div>

  );

};

export default AdminSettings;
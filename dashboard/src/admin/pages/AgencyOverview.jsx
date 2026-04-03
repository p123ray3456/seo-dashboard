import "../styles/agencyOverview.css";
import { useEffect, useState } from "react";
import axios from "axios";

const AgencyOverview = () => {

  const [clients,setClients] = useState([]);
  const [reports,setReports] = useState([]);

  const [stats,setStats] = useState({
    totalClients:0,
    activeProjects:0
  });

  useEffect(()=>{
    loadAgencyData();
    loadReports();
  },[]);

  const loadAgencyData = async () => {

    try{

      const res = await axios.get("https://seo-dashboard-production-ec44.up.railway.app/clients");

      const clientsData = res.data;

      setClients(clientsData);

      const activeProjects = clientsData.filter(
        c => c.status === "Active"
      ).length;

      setStats({
        totalClients:clientsData.length,
        activeProjects:activeProjects
      });

    }
    catch(err){
      console.log(err);
    }

  };

  const loadReports = async () =>{

    try{

      const res = await axios.get(
        "https://seo-dashboard-production-ec44.up.railway.app/agency-reports"
      );

      setReports(res.data);

    }
    catch(err){
      console.log(err);
    }

  };

  const statCards = [
    {
      title:"Total Clients",
      value:stats.totalClients,
      note:"Agency Clients",
      icon:"bi-people"
    },
    {
      title:"Active Projects",
      value:stats.activeProjects,
      note:"Running SEO campaigns",
      icon:"bi-briefcase"
    }
  ];

  return(

    <div className="ao-wrapper">

      {/* HEADER */}

      <div className="ao-header">
        <h4>Agency Overview</h4>
        <p>Performance metrics for your SEO agency.</p>
      </div>

      {/* STATS */}

      <div className="ao-stats">

        {statCards.map((item,i)=>(
          <div className="ao-card" key={i}>

            <div>
              <small>{item.title}</small>
              <h3>{item.value}</h3>
              <span className="muted">{item.note}</span>
            </div>

            <i className={`bi ${item.icon}`}></i>

          </div>
        ))}

      </div>

      {/* GRID */}

      <div className="ao-grid">

        {/* RECENT CLIENTS */}

        <div className="ao-box">

          <h6>Recent Clients</h6>

          {clients.slice(0,5).map((client,i)=>(

            <div className="activity-item" key={i}>

              <div className="badge">
                {client.name.substring(0,2)}
              </div>

              <div>

                <strong>{client.name}</strong>

                <p>{client.domain}</p>

                <small>{client.plan}</small>

              </div>

            </div>

          ))}

        </div>

        {/* MONTHLY REPORTS */}

        {/* <div className="ao-box">

          <h6>Latest Monthly Reports</h6>

          {reports.length === 0 ? (

            <p className="muted">No reports available</p>

          ) : (

            reports.slice(0,5).map((report,i)=>(

              <div className="report-item" key={i}>

                <strong>{report.month}</strong>

                <p>{report.summary.substring(0,60)}...</p>

                <small>
                  Client ID: {report.clientId} • By {report.author}
                </small>

              </div>

            ))

          )}

        </div> */}

      </div>

    </div>

  );

};

export default AgencyOverview;
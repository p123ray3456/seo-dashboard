import "../styles/settings.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Settings = () => {

  const { clientId } = useParams();
  const [client,setClient] = useState(null);

  useEffect(()=>{
    loadClient();
  },[]);

  const loadClient = async () => {

    try{

      const res = await axios.get(
        `https://seo-dashboard-production-ec44.up.railway.app/clients/${clientId}`
      );

      setClient(res.data);

    }catch(err){
      console.log(err);
    }

  };

  if(!client){
    return (
      <div className="settings-wrapper container-fluid">
        Loading...
      </div>
    );
  }

  return (

    <div className="settings-wrapper container-fluid">

      {/* Header */}

      <div className="settings-header">

        <h4>Account Settings</h4>

        <p>
          View your account details and data configuration.
        </p>

      </div>


      {/* CLIENT PROFILE */}

      <div className="settings-card">

        <h6>Client Profile (Read-Only)</h6>

        <div className="settings-grid">

          <div>
            <label>Company Name</label>

            <input
              type="text"
              value={client.name}
              disabled
            />
          </div>

          <div>
            <label>Website URL</label>

            <input
              type="text"
              value={client.domain}
              disabled
            />
          </div>

          <div>
            <label>Contact Email</label>

            <input
              type="text"
              value={client.email || "Not Available"}
              disabled
            />
          </div>

          <div>
            <label>Plan</label>

            <input
              type="text"
              value={client.plan || "SEO Plan"}
              disabled
            />
          </div>

        </div>

      </div>


      {/* DATA SOURCE SECTION */}

      <div className="settings-card highlight">

        <h6>Data Source Transparency</h6>

        <p className="settings-desc">

          To ensure complete accuracy, your dashboard aggregates data directly
          from the industry’s most trusted official sources.

        </p>

        <div className="source-grid">

          <div className="source-card">

            <span className="source-badge ga">GA4</span>

            <h6>Traffic & Behavior</h6>

            <small>Source: Google Analytics 4</small>

            <p>
              Tracks real human visitors from Organic Search traffic.
            </p>

          </div>


          <div className="source-card">

            <span className="source-badge gsc">GSC</span>

            <h6>Search Performance</h6>

            <small>Source: Google Search Console</small>

            <p>
              Shows impressions, clicks and keyword performance.
            </p>

          </div>


          <div className="source-card">

            <span className="source-badge rank">Rank</span>

            <h6>Keyword Rankings</h6>

            <small>Source: Rank Tracker</small>

            <p>
              Tracks keyword ranking improvements over time.
            </p>

          </div>


          <div className="source-card">

            <span className="source-badge audit">Audit</span>

            <h6>Work Log & Audit</h6>

            <small>Source: Agency SEO Team</small>

            <p>
              Verified SEO activities performed by our team.
            </p>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Settings;
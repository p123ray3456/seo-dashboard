import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Support = () => {

  const { clientId } = useParams();

  const [subject,setSubject] = useState("");
  const [message,setMessage] = useState("");

  const sendMessage = async () => {

    if(!subject || !message){
      alert("Please fill all fields");
      return;
    }

    try{

      await axios.post("https://seo-dashboard-production-ec44.up.railway.app/support-message",{
        clientId,
        subject,
        message
      });

      alert("Message sent to admin");

      setSubject("");
      setMessage("");

    }catch(err){

      console.log(err);
      alert("Error sending message");

    }

  };

  return (

    <div className="container-fluid support-wrapper">

      <div className="support-header">

        <h4>Contact Your SEO Manager</h4>

        <p className="text-muted">
          Send a message directly to your SEO team.
        </p>

      </div>


      <div className="card support-card p-4">

        <div className="mb-3">

          <label className="form-label">Subject</label>

          <input
            type="text"
            className="form-control"
            value={subject}
            onChange={(e)=>setSubject(e.target.value)}
          />

        </div>


        <div className="mb-3">

          <label className="form-label">Message</label>

          <textarea
            rows="4"
            className="form-control"
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
          />

        </div>


        <button
          className="btn btn-primary support-btn"
          onClick={sendMessage}
        >
          Send Message
        </button>

      </div>

    </div>

  );

};

export default Support;
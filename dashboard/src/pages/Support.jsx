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

    await axios.post("http://localhost:5000/support-message",{

      clientId,
      subject,
      message

    });

    alert("Message sent to admin");

    setSubject("");
    setMessage("");

  };

  return (

    <div className="container">

      <h4 className="mb-4">Contact Your SEO Manager</h4>

      <div className="card p-4">

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

        <button className="btn btn-primary" onClick={sendMessage}>
          Send Message
        </button>

      </div>

    </div>

  );

};

export default Support;
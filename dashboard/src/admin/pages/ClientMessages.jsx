import { useEffect, useState } from "react";
import axios from "axios";

const ClientMessages = () => {

  const [messages,setMessages] = useState([]);

  useEffect(()=>{
    loadMessages();
  },[]);

  const loadMessages = async () => {

    const res = await axios.get(
      "https://digigrowth.digital/support-messages"
    );

    setMessages(res.data);

  };

  return(

    <div className="container">

      <h4 className="mb-4">Client Messages</h4>

      {messages.map(msg=>(
        <div className="card p-3 mb-3">

          <h6>{msg.subject}</h6>

          <p>{msg.message}</p>

          <small>Client ID: {msg.clientId}</small>

        </div>
      ))}

    </div>

  );

};

export default ClientMessages;
import "../styles/nextMonthPlan.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const NextMonthPlan = () => {

  const { clientId } = useParams();

  const [plan,setPlan] = useState(null);

  useEffect(()=>{
    loadPlan();
  },[]);

  const loadPlan = async () => {

    const res = await axios.get(
      `http://localhost:5000/next-month-plan/${clientId}`
    );

    setPlan(res.data);

  };

  if(!plan){
    return <p>Loading...</p>;
  }

  return (
    <div className="nmp-wrapper">

      <div className="nmp-header">
        <div>
          <h4>Next Month Plan</h4>
          <p>Strategic roadmap for {plan.month}</p>
        </div>
      </div>

      <div className="nmp-timeline">

        {plan.roadmap.map((item,index)=>(
          <div className="nmp-item" key={index}>

            <div className="nmp-line">
              <span className="nmp-dot" />
              {index !== plan.roadmap.length - 1 && (
                <span className="nmp-connector" />
              )}
            </div>

            <div className="nmp-card">
              <h6>{item.title}</h6>
              <span className="nmp-badge">{item.status}</span>
            </div>

          </div>
        ))}

      </div>

    </div>
  );

};

export default NextMonthPlan;
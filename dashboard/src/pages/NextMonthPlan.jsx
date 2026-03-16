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

    try {

      const res = await axios.get(
        `http://localhost:5000/next-month-plan/${clientId}`
      );

      setPlan(res.data);

    } catch(err){
      console.log(err);
    }

  };

  if(!plan){
    return (
      <div className="nmp-wrapper container-fluid">
        Loading...
      </div>
    );
  }

  return (

    <div className="nmp-wrapper container-fluid">

      {/* HEADER */}

      <div className="nmp-header">

        <div>
          <h4>Next Month Plan</h4>
          <p>Strategic roadmap for {plan.month}</p>
        </div>

      </div>


      {/* TIMELINE */}

      <div className="nmp-timeline">

        {plan.roadmap.map((item,index)=>(

          <div className="nmp-item" key={index}>

            <div className="nmp-line">

              <span className="nmp-dot" />

            </div>


            <div className="nmp-card">

              <h6>{item.title}</h6>

              <span className="nmp-badge">
                {item.status}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default NextMonthPlan;
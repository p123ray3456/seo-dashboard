import { useEffect, useState } from "react";

const NextMonthReminder = () => {

  const [show, setShow] = useState(false);

  useEffect(() => {

    const today = new Date();

    const lastDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();

    if (today.getDate() >= lastDate - 9) {
      setShow(true);
    }

  }, []);

  if (!show) return null;

  return (

    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 9999,
      width: "320px"
    }}>

      <div className="alert alert-warning shadow">

        <strong>⚠️ Reminder</strong>
        <p className="mb-1">
          Create next month plan for clients
        </p>

        <button
          className="btn btn-sm btn-dark w-100"
          onClick={()=>setShow(false)}
        >
          Dismiss
        </button>

      </div>

    </div>

  );

};

export default NextMonthReminder;
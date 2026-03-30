import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import NextMonthReminder from "./styles/NextMonthReminder";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-container">

      {/* 🔥 REMINDER */}
      <NextMonthReminder />

      {/* ✅ MOBILE HEADER */}
      <div className="mobile-header">
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <span className="fw-bold">Admin Dashboard</span>
      </div>

      {/* ✅ SIDEBAR */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* ✅ MAIN CONTENT */}
      <div className="main-content">
        <Outlet />
      </div>

      {/* ✅ SAME CSS SYSTEM AS CLIENT */}
      <style>{`

.dashboard-container{
display:flex;
height:100vh;
background:#f1f5f9;
overflow:hidden;
}

/* SIDEBAR */
.sidebar{
width:260px;
background:#0f172a;
padding:20px 18px;
display:flex;
flex-direction:column;
justify-content:space-between;
transition:0.3s;
overflow-y:auto;
}

/* CONTENT */
.main-content{
flex:1;
padding:24px;
overflow-y:auto;
height:100vh;
}

/* MOBILE HEADER */
.mobile-header{
display:none;
background:white;
padding:12px 16px;
border-bottom:1px solid #e5e7eb;
align-items:center;
gap:12px;
}

.menu-btn{
background:none;
border:none;
font-size:22px;
cursor:pointer;
}

/* TABLET */
@media (max-width:992px){
.sidebar{
width:220px;
}
.main-content{
padding:20px;
}
}

/* MOBILE */
@media (max-width:768px){

.dashboard-container{
flex-direction:column;
height:auto;
}

.mobile-header{
display:flex;
}

.sidebar{
position:fixed;
left:-260px;
top:0;
height:100%;
z-index:999;
}

.sidebar.open{
left:0;
}

.main-content{
height:auto;
padding:18px;
}

}

      `}</style>

    </div>
  );
};

export default AdminLayout;
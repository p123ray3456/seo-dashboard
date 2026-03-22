import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import NextMonthReminder from "./styles/NextMonthReminder"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AdminLayout = () => {
  return (
    <div className="d-flex vh-100">

      {/* 🔥 GLOBAL REMINDER (appears on login) */}
      <NextMonthReminder />

      {/* Sidebar */}
      <AdminSidebar />

      {/* Content */}
      <div className="flex-grow-1 bg-light p-4 overflow-auto">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;
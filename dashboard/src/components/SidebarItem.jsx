import React from "react";

const SidebarItem = ({ label, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        background: active ? "#eef2ff" : "transparent",
        color: active ? "#2563eb" : "#333",
        fontWeight: active ? "600" : "400",
      }}
    >
      {label}
    </div>
  );
};

export default SidebarItem;

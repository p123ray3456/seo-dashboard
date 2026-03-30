import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";

/* ================= ADMIN ================= */

import AdminLayout from "./admin/AdminLayout";
import AgencyOverview from "./admin/pages/AgencyOverview";
import ManageClients from "./admin/pages/ManageClients";
import TeamMembers from "./admin/pages/TeamMembers";
import AdminSettings from "./admin/pages/AdminSettings";
import ClientAdminSettings from "./admin/pages/ClientAdminSettings";
import AddClient from "./admin/pages/AddClient";
import EditClient from "./admin/pages/EditClient";
import EditMonthlySummary from "./admin/pages/EditMonthlySummary";
import EditNextMonthPlan from "./admin/pages/EditNextMonthPlan";
import ClientMessages from "./admin/pages/ClientMessages";


/* ================= CLIENT DASHBOARD ================= */

import TeamLayout from "./admin/TeamLayout";
import TeamDashboard from "./admin/TeamDashboard";
import TeamWorkLog from "./admin/TeamWorkLog";
import TeamPlan from "./admin/TeamPlan";
import TeamGenerateBlog from "./admin/TeamGenerateBlog";
/* CLIENT PAGES */
import Overview from "./pages/Overview";
import SearchConsole from "./pages/SearchConsole";
import KeywordPerformance from "./pages/KeywordPerformance";
import TrafficGrowth from "./pages/TrafficGrowth";
import WorkLog from "./pages/WorkLog";
import MonthlySummary from "./pages/MonthlySummary";
import NextMonthPlan from "./pages/NextMonthPlan";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import LeadsConversions from "./pages/LeadsConversions";
import ClientLayout from "./client/ClientLayout";
function App() {
  return (
    <Routes>

      {/* ================= DEFAULT ================= */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ================= LOGIN ================= */}
      <Route path="/login" element={<Login />} />

      {/* ================= ADMIN PANEL ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Default admin page */}
        <Route index element={<AgencyOverview />} />

        {/* Admin Pages */}
        <Route path="overview" element={<AgencyOverview />} />
        <Route path="clients" element={<ManageClients />} />
        <Route path="clients/add" element={<AddClient />} />
        <Route path="clients/edit/:clientId" element={<EditClient />} />
        <Route path="monthly-summary" element={<EditMonthlySummary />} />
        <Route path="next-month-plan" element={<EditNextMonthPlan />} />
        <Route path="messages" element={<ClientMessages />} />
        {/* Client Settings from Admin */}
        <Route
          path="clients/:clientId/settings"
          element={<ClientAdminSettings />}
        />

        <Route path="team" element={<TeamMembers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="/team/:clientId" element={<TeamLayout />}>
  <Route path="dashboard" element={<TeamDashboard />} />
  <Route path="worklog" element={<TeamWorkLog />} />
  <Route path="plan" element={<TeamPlan />} />
  <Route path="generate-blog" element={<TeamGenerateBlog />} />
</Route>

      {/* ================= CLIENT DASHBOARD ================= */}
      <Route
        path="/dashboard/:clientId"
        element={
          <ProtectedRoute role="client">
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        {/* Default client page */}
        <Route index element={<Navigate to="overview" replace />} />

        {/* Client Pages */}
        <Route path="overview" element={<Overview />} />
        <Route path="search-console" element={<SearchConsole />} />
        <Route path="keywords" element={<KeywordPerformance />} />
        <Route path="traffic" element={<TrafficGrowth />} />
        <Route path="work-log" element={<WorkLog />} />
        <Route path="monthly-summary" element={<MonthlySummary />} />
        <Route path="next-month-plan" element={<NextMonthPlan />} />
        <Route path="settings" element={<Settings />} />
        <Route path="support" element={<Support />} />
        <Route path="leads" element={<LeadsConversions />} />
      </Route>

    </Routes>
  );
}

export default App;

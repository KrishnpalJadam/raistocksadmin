import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Login from "./Auth/Login";
import Dashboard from "./Components/Dashboard";
import MainLayout from "./Layout/MainLayout";

import Payments from "./Components/Payments";
import Clients from "./Components/ClientJourny/Clients";
import ClientAllDetails from "./Components/ClientJourny/ClientAllDetails";

import SubscriptionPlans from "./Components/SubscriptionPlans";
import Emails from "./Components/Emails";
import RAIData from "./Components/RAIData";
import Support from "./Components/Support";
import UserManagement from "./Components/UserManagement";
import Leads from "./Components/Leads";
import Settings from "./Components/Settings";
import TradeSatup from "./Components/TradeSatup";
import ResearchReportAdd from "./Components/ResearchReportAdd";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Admin Panel */}
        <Route path="/admin/*" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          {/* === Clients Management === */}
          <Route path="clients" element={<Clients />} />
          <Route path="clientsDetails" element={<ClientAllDetails />} />
          <Route path="payments" element={<Payments />} />
          <Route path="plans" element={<SubscriptionPlans />} />
          <Route path="emails" element={<Emails />} />
          <Route path="rai-data" element={<RAIData />} />
          <Route path="support" element={<Support />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="leads" element={<Leads />} />
          <Route path="settings" element={<Settings />} />
          <Route path="tradeSatup" element={<TradeSatup />} />
          <Route path="addResearchReport" element={<ResearchReportAdd />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;

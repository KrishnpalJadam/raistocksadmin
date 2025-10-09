



import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'
import Login from "./Auth/Login";
import Dashboard from "./Components/Dashboard";
import MainLayout from "./Layout/MainLayout";
import Clients from "./Components/Clients";
import Payments from "./Components/Payments";
import SubscriptionPlans from "./Components/SubscriptionPlans";
import Emails from "./Components/Emails";
import RAIData from "./Components/RAIData";
import Support from "./Components/Support";
import UserManagement from "./Components/UserManagement";
import Leads from "./Components/Leads";
import Settings from "./Components/Settings";
import TradeSatup from "./Components/TradeSatup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
       {/* Admin Panel */}
        <Route path="/admin/*" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="payments" element={<Payments />} />
          <Route path="plans" element={<SubscriptionPlans />} />
          <Route path="emails" element={<Emails />} />
          <Route path="rai-data" element={<RAIData />} />
          <Route path="support" element={<Support />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="leads" element={<Leads />} />
          <Route path="settings" element={<Settings />} />
          <Route path="tradeSatup" element={<TradeSatup />} />
         
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

 
import React, { useEffect } from "react";
import {
  Home,
  Users,
  CreditCard,
  FileText,
  Mail,
  BarChart3,
  Ticket,
  User,
  TrendingUp,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRolePermissions } from "../slices/rolesPermissionSlice";

const Sidebar = () => {
  const location = useLocation();
  const activePage = location.pathname.split("/")[2];
  const dispatch = useDispatch();

  const userRole = localStorage.getItem("user_role") || "";
  useEffect(() => {
    dispatch(fetchRolePermissions());
  }, []);

  const roles = useSelector(
    (state) => state?.rolesPermission?.roles || []
  );

  // 🔥 Find logged-in user's access permissions
  const currentRole = roles.find((r) => r.role === userRole);
  const access = currentRole?.access || {};


  // 🔥 Map menu items to backend permission keys
  const menuItems = [
    { name: "Dashboard", icon: Home, path: "dashboard", key: "dashboard" },
    { name: "Clients", icon: Users, path: "clients", key: "clients" },
    { name: "Payments & Invoices", icon: CreditCard, path: "payments", key: "payments" },
    { name: "Subscription Plans", icon: FileText, path: "plans", key: "plans" },
    { name: "Emails & Notifications", icon: Mail, path: "emails", key: "emails" },
    { name: "Trade Recommendation", icon: BarChart3, path: "rai-data", key: "rai" },
    { name: "Trade Setup", icon: BarChart3, path: "tradeSatup", key: "tradeSetup" },
    { name: "Support", icon: Ticket, path: "support", key: "support" },
    { name: "User Management", icon: User, path: "user-management", key: "users" },
    { name: "Leads", icon: TrendingUp, path: "leads", key: "leads" },
    { name: "Create Coupon Code", icon: TrendingUp, path: "CreateCouponCode", key: "coupon" },
    { name: "Add Research Report", icon: TrendingUp, path: "addResearchReport", key: "reSearch" },
    { name: "Settings", icon: Settings, path: "settings", key: "settings" },
  ];

  // 🔥 Filter items based on permissions — Admin sees all
  const filteredMenu = userRole === "Admin"
    ? menuItems
    : menuItems.filter((item) => access[item.key]);

  return (
    <div className="sidebar d-flex flex-column">
      <div className="sidebar-header">CRM Admin Panel</div>
      <nav className="nav flex-column mt-3">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={`/admin/${item.path}`}
              className={`nav-link ${activePage === item.path ? "active" : ""}`}
            >
              <Icon className="lucide-icon" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;

import React from "react";
import {
  Users,
  FileText,
  CreditCard,
  ShoppingBag,
  MessageSquare,
  BookOpen,
  Layers,
  Shield,
} from "lucide-react";
import { Card } from "react-bootstrap";
import { Line, Doughnut } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  // KPI Data - As per CRM Requirements
  const kpis = [
    { title: "Total Clients", value: "1,250", icon: <Users size={28} />, color: "#4e73df" },
    { title: "KYC Pending", value: "145", icon: <FileText size={28} />, color: "#1cc88a" },
    { title: "Active Subscriptions", value: "876", icon: <ShoppingBag size={28} />, color: "#36b9cc" },
    { title: "Payments Received", value: "₹12,50,000", icon: <CreditCard size={28} />, color: "#f6c23e" },
    { title: "Support Tickets", value: "52 Open", icon: <MessageSquare size={28} />, color: "#e74a3b" },
  ];

  // Sales / Revenue Chart Data
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [120000, 150000, 140000, 180000, 220000, 200000],
        borderColor: "#4e73df",
        backgroundColor: "rgba(78, 115, 223, 0.2)",
        fill: true,
      },
    ],
  };

  // Subscription Split (Investor, Trader, Trial)
  const subscriptionData = {
    labels: ["Investors", "Traders", "Trial Users"],
    datasets: [
      {
        label: "Subscriptions",
        data: [400, 320, 156],
        backgroundColor: ["#1cc88a", "#4e73df", "#f6c23e"],
      },
    ],
  };

  // KYC Status Split
  const kycData = {
    labels: ["Verified", "Pending", "Rejected"],
    datasets: [
      {
        label: "KYC Status",
        data: [900, 250, 100],
        backgroundColor: ["#36b9cc", "#f6c23e", "#e74a3b"],
      },
    ],
  };

  return (
    <div className="dashboard-page container-fluid">
      {/* Page Title */}
      <div className="dashboard-header mb-4">
        <h3 className="fw-bold">CRM Admin Dashboard</h3>
        <p className="text-muted">Overview of Clients, Subscriptions, Payments and Support</p>
      </div>

      {/* KPI Cards */}
      <div className="row">
        {kpis.map((kpi, index) => (
          <div className="col-md-3 col-lg-4 mb-4" key={index}>
            <Card className="dashboard-card shadow-sm border-0 h-100">
              <Card.Body className="d-flex align-items-center">
                <div
                  className="dashboard-icon d-flex align-items-center justify-content-center me-3 text-white rounded-circle p-3"
                  style={{ backgroundColor: kpi.color }}
                >
                  {kpi.icon}
                </div>
                <div>
                  <h6 className="mb-0">{kpi.title}</h6>
                  <h5 className="fw-bold">{kpi.value}</h5>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* Graph Section */}
      <div className="row mt-4">
        <div className="col-lg-6 mb-4">
          <Card className="dashboard-graph shadow-sm border-0 h-100">
            <Card.Header className="bg-white fw-bold">Revenue Overview</Card.Header>
            <Card.Body>
              <Line data={revenueData} />
            </Card.Body>
          </Card>
        </div>

        <div className="col-lg-3 mb-4">
          <Card className="dashboard-graph shadow-sm border-0 h-100">
            <Card.Header className="bg-white fw-bold">Subscription Types</Card.Header>
            <Card.Body>
              <Doughnut data={subscriptionData} />
            </Card.Body>
          </Card>
        </div>

        <div className="col-lg-3 mb-4">
          <Card className="dashboard-graph shadow-sm border-0 h-100">
            <Card.Header className="bg-white fw-bold">KYC Status</Card.Header>
            <Card.Body>
              <Doughnut data={kycData} />
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Quick Links Section */}
      {/* <div className="row mt-4">
        <div className="col-lg-12">
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white fw-bold">Quick Access</Card.Header>
            <Card.Body className="d-flex flex-wrap gap-4">
              <button className="btn btn-outline-primary d-flex align-items-center gap-2">
                <Users size={18} /> Manage Clients
              </button>
              <button className="btn btn-outline-success d-flex align-items-center gap-2">
                <FileText size={18} /> KYC Verification
              </button>
              <button className="btn btn-outline-warning d-flex align-items-center gap-2">
                <ShoppingBag size={18} /> Subscriptions
              </button>
              <button className="btn btn-outline-info d-flex align-items-center gap-2">
                <CreditCard size={18} /> Payments
              </button>
              <button className="btn btn-outline-danger d-flex align-items-center gap-2">
                <MessageSquare size={18} /> Support Tickets
              </button>
              <button className="btn btn-outline-dark d-flex align-items-center gap-2">
                <BookOpen size={18} /> Trade Diary Data
              </button>
              <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
                <Layers size={18} /> Leads
              </button>
              <button className="btn btn-outline-dark d-flex align-items-center gap-2">
                <Shield size={18} /> Settings
              </button>
            </Card.Body>
          </Card>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;

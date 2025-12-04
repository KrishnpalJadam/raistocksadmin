 import React from "react";
import { Card } from "react-bootstrap";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats, fetchRevenueStats } from "../slices/dashboardSlice";
import {
  Users,
  FileText,
  CreditCard,
  ShoppingBag,
  MessageSquare,
} from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, revenue } = useSelector((state) => state.dashboard);

  const [mode, setMode] = React.useState("daily");

  React.useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRevenueStats());
  }, [dispatch]);

  // ========= CHART CONFIG =========
  const chartConfig = {
    daily: {
      labels: revenue?.daily?.map((d) => d.day),
      values: revenue?.daily?.map((d) => d.amount),
      type: "line",
    },
    weekly: {
      labels: revenue?.weekly?.map((w) => w.range),
      values: revenue?.weekly?.map((w) => w.amount),
      type: "bar",
    },
    monthly: {
      labels: revenue?.monthly?.map((m) => m.month),
      values: revenue?.monthly?.map((m) => m.amount),
      type: "combo",
    },
  };

  const selected = chartConfig[mode];

  const lineDataset = {
    label: `Revenue (${mode.toUpperCase()})`,
    data: selected.values,
    borderColor: "#4e73df",
    backgroundColor: "rgba(78, 115, 223, 0.3)",
    fill: true,
    tension: 0.4,
  };

  const barDataset = {
    label: "Revenue (₹)",
    data: selected.values,
    backgroundColor: "rgba(46, 204, 113, 0.5)",
    borderRadius: 8,
  };

  const datasets =
    mode === "monthly"
      ? [barDataset, lineDataset]
      : mode === "weekly"
      ? [barDataset]
      : [lineDataset];

  const chartData = {
    labels: selected.labels,
    datasets,
  };

  // ========= KPI CARDS =========
  const kpis = [
    {
      title: "Total Clients",
      value: stats?.totalClients,
      icon: <Users size={28} />,
      color: "#4e73df",
    },
    {
      title: "KYC Pending",
      value: stats?.kycPending,
      icon: <FileText size={28} />,
      color: "#1cc88a",
    },
    {
      title: "Active Subscriptions",
      value: stats?.activeSubscriptions,
      icon: <ShoppingBag size={28} />,
      color: "#36b9cc",
    },
    {
      title: "Payments Received",
      value: stats?.totalRevenue,
      icon: <CreditCard size={28} />,
      color: "#f6c23e",
    },
    {
      title: "Support Tickets",
      value: stats?.openTickets,
      icon: <MessageSquare size={28} />,
      color: "#e74a3b",
    },
  ];

  return (
    <div className="dashboard-page container-fluid">
      <div className="dashboard-header mb-4">
        <h3 className="fw-bold">CRM Admin Dashboard</h3>
        <p className="text-muted">
          Overview of Clients, Subscriptions, Revenue & Support
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="row">
        {kpis.map((kpi, index) => (
          <div className="col-md-3 col-lg-4 mb-4" key={index}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="d-flex align-items-center">
                <div
                  className="me-3 p-3 rounded-circle text-white d-flex align-items-center justify-content-center"
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

      {/* REVENUE GRAPH */}
      <Card className="shadow-sm border-0 mt-4">
        <div className="d-flex justify-content-between p-3">
          <h5 className="fw-bold">Sales Overview</h5>

          <div>
            <button
              className={`btn btn-sm ${
                mode === "daily" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setMode("daily")}
            >
              Daily
            </button>

            <button
              className={`btn btn-sm mx-2 ${
                mode === "weekly" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setMode("weekly")}
            >
              Weekly
            </button>

            <button
              className={`btn btn-sm ${
                mode === "monthly" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setMode("monthly")}
            >
              Monthly
            </button>
          </div>
        </div>

        <Card.Body>
          {mode === "weekly" ? (
            <Bar data={chartData} />
          ) : (
            <Line data={chartData} />
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;

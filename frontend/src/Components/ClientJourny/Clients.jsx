import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Edit,
  Eye,
  FileText,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "./clint.css"
// --- STATIC DUMMY DATA ---
const DUMMY_CLIENTS = [
  {
    id: "RAI25OCT120001",
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@corp.com',
    contact: '+91 98765 43210',
    whatsApp: '+91 98765 43210',
    aadhaar: 'XXXX XXXX 1234',
    pan: 'ABCDE1234F',
    subscription: 'Trader Premium',
    plan: '3 Months',
    status: 'Active',
    kycStatus: 'Approved',
    periodFrom: '15/07/2024',
    periodTo: '15/10/2024',
    daysLeft: 35,
  },
  {
    id: "RAI25OCT120002",
    name: 'Deepa Patel',
    email: 'deepa.p@inbox.in',
    contact: '+91 90123 45678',
    whatsApp: '+91 90123 45678',
    aadhaar: 'XXXX XXXX 5678',
    pan: 'FGHIJ5678G',
    subscription: 'Trial',
    plan: '7 Days',
    status: 'Inactive',
    kycStatus: 'Pending',
    periodFrom: '01/10/2024',
    periodTo: '08/10/2024',
    daysLeft: 0,
  },
  {
    id: "RAI25OCT120003",
    name: 'Amit Singh',
    email: 'amit.s@investor.co',
    contact: '+91 88888 77777',
    whatsApp: '+91 88888 77777',
    aadhaar: 'XXXX XXXX 9012',
    pan: 'KLMNO9012H',
    subscription: 'Investor',
    plan: '1 Year',
    status: 'Active',
    kycStatus: 'Rejected',
    periodFrom: '01/01/2024',
    periodTo: '01/01/2025',
    daysLeft: 5,
  },
  {
    id: "RAI25OCT120004",
    name: 'Priya Rao',
    email: 'priya.rao@support.org',
    contact: '+91 70000 66666',
    whatsApp: '+91 70000 66666',
    aadhaar: 'XXXX XXXX 3456',
    pan: 'PQRST3456I',
    subscription: 'Extended Trial',
    plan: '30 Days',
    status: 'Active',
    kycStatus: 'Approved',
    periodFrom: '10/09/2024',
    periodTo: '10/10/2024',
    daysLeft: 15,
  },
];

// --- BADGE UTILITIES ---
const getSubscriptionBadge = (sub) => {
  let color;
  switch (sub) {
    case 'Trial': color = 'secondary'; break;
    case 'Extended Trial': color = 'warning'; break;
    case 'Investor': color = 'info'; break;
    case 'Trader': color = 'primary'; break;
    case 'Trader Premium': color = 'success'; break;
    default: color = 'light';
  }
  return <span className={`badge bg-${color} rounded-pill`}>{sub}</span>;
};

const getKycBadge = (status) => {
  let color;
  switch (status) {
    case 'Pending': color = 'warning'; break;
    case 'Approved': color = 'success'; break;
    case 'Rejected': color = 'danger'; break;
    default: color = 'light';
  }
  return <span className={`badge bg-${color} rounded-pill`}>{status}</span>;
};

const getDaysLeftBadge = (days) => {
  let color = 'success';
  if (days === 0) { color = 'danger'; }
  else if (days < 10) { color = 'warning'; }
  return <span className={`badge bg-${color} rounded-pill`}>{days} Days</span>;
};

const getStatusBadge = (status) => {
  const color = status === 'Active' ? 'primary' : 'secondary';
  return <span className={`badge bg-opacity-10 text-${color} border border-${color} rounded-pill`}>{status}</span>;
};

// --- CLIENTS COMPONENT ---
const Clients = ({ onViewDetails }) => {
  // Simple state for UI controls (static data doesn't require actual filtering logic)
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All Subscriptions');
  const navigate = useNavigate()

  const clientsToDisplay = DUMMY_CLIENTS.length;
  const totalClients = DUMMY_CLIENTS.length;

  return (
    <div className="crm-container">
      {/* Top Section: Title & Controls */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 p-3 bg-white shadow-sm rounded-3 border-start border-4 border-primary crm-header-card">
        <h2 className="mb-0 fs-4 text-dark-emphasis">Clients Management</h2>

        <div className="d-flex align-items-center flex-grow-1 flex-md-grow-0 ms-md-5 mt-2 mt-md-0">
          <div className="input-group input-group-sm me-3" style={{ maxWidth: '300px' }}>
            <span className="input-group-text bg-white border-end-0 text-muted"><Search size={16} /></span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary btn-sm dropdown-toggle text-start"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <ChevronDown size={14} className="me-1" />
              {filter}
            </button>
            <ul className="dropdown-menu">
              {['All Subscriptions', 'Trial', 'Extended Trial', 'Investor', 'Trader', 'Trader Premium'].map(item => (
                <li key={item}><a className="dropdown-item" href="#" onClick={() => setFilter(item)}>{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mb-0 ms-auto text-muted small mt-2 mt-md-0">
          Showing <strong className="text-dark">{clientsToDisplay}</strong> of <strong className="text-dark">{totalClients}</strong> results
        </p>
      </div>

      {/* Clients Table Card */}
      <div className="card shadow-sm rounded-3 border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0 crm-table">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="text-uppercase small fw-bold">#ID</th>
                  <th scope="col" className="text-uppercase small fw-bold">Client Name</th>
                  <th scope="col" className="text-uppercase small fw-bold">Email</th>
                  <th scope="col" className="text-uppercase small fw-bold d-none d-lg-table-cell">Contact No</th>
                  <th scope="col" className="text-uppercase small fw-bold d-none d-xl-table-cell">WhatsApp</th>
                  <th scope="col" className="text-uppercase small fw-bold d-none d-xl-table-cell">Aadhaar / PAN</th>
                  <th scope="col" className="text-uppercase small fw-bold">Subscription</th>
                  <th scope="col" className="text-uppercase small fw-bold d-none d-md-table-cell">Validity (From - To)</th>
                  <th scope="col" className="text-uppercase small fw-bold">Days Left</th>
                  <th scope="col" className="text-uppercase small fw-bold d-none d-md-table-cell">Plan</th>
                  <th scope="col" className="text-uppercase small fw-bold">KYC Status</th>
                  {/* <th scope="col" className="text-uppercase small fw-bold d-none d-sm-table-cell">Status</th> */}
                  <th scope="col" className="text-uppercase small fw-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {DUMMY_CLIENTS.map((client) => (
                  <tr key={client.id}>
                    <td className="fw-bold text-primary small">#{client.id}</td>
                    <td>{client.name}</td>
                    <td><span className="small text-muted">{client.email}</span></td>
                    <td className="d-none d-lg-table-cell">{client.contact}</td>
                    <td className="d-none d-xl-table-cell">{client.whatsApp}</td>
                    <td className="d-none d-xl-table-cell small text-muted">
                      <span className="d-block text-nowrap">Aadhaar: {client.aadhaar}</span>
                      <span className="d-block text-nowrap">PAN: {client.pan}</span>
                    </td>
                    <td>{getSubscriptionBadge(client.subscription)}</td>
                    <td className="small text-muted d-none d-md-table-cell text-nowrap">
                      {client.periodFrom} - {client.periodTo}
                    </td>
                    <td>{getDaysLeftBadge(client.daysLeft)}</td>
                    <td className="d-none d-md-table-cell small text-nowrap">{client.plan}</td>
                    <td>{getKycBadge(client.kycStatus)}</td>
                    {/* <td className="d-none d-sm-table-cell">{getStatusBadge(client.status)}</td> */}
                    <td className="text-center">
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-outline-info btn-sm crm-action-btn me-2"
                          title="View Details"
                          onClick={() => navigate('/admin/clientsDetails')}
                        >
                          <Eye size={16} />
                        </button>

                        <button className="btn btn-outline-primary btn-sm crm-action-btn me-2" title="Edit Client">
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-outline-secondary btn-sm crm-action-btn me-2 d-none d-sm-block" title="Generate Invoice">
                          <FileText size={16} />
                        </button>
                        {/* <button className="btn btn-outline-success btn-sm crm-action-btn d-none d-sm-block" title="Process Payment">
                          <DollarSign size={16} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;

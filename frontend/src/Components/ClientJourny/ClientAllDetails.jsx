import React, { useState } from 'react';
import {
  User,
  Zap,
  Briefcase,
  Layers,
  Calendar,
  Wallet,
  Eye,
  Download,
  FileText,
  Edit,
  File,

} from 'lucide-react';
import { MdAddCall } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
import { Line, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);
// --- STATIC DUMMY DATA ---
const DUMMY_CLIENT = {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@corp.com',
    contact: '+91 98765 43210',
    whatsApp: '+91 98765 43210',
    aadhaar: 'XXXX XXXX 1234',
    pan: 'ABCDE1234F',
    subscription: 'Trader Premium',
    plan: 'Pro Trader (3 Months)',
    status: 'Active',
    kycStatus: 'Approved',
    periodFrom: '15/07/2024',
    periodTo: '15/10/2024',
    daysLeft: 35,
};

const DUMMY_SALES = [
    { date: '25/09/2024', type: 'New Subscription', amount: '₹ 15,000' },
    { date: '01/08/2024', type: 'Renewal Fee', amount: '₹ 12,000' },
    { date: '10/07/2024', type: 'Upgrade Fee', amount: '₹ 3,000' },
    { date: '05/06/2024', type: 'Add-on Service', amount: '₹ 1,500' },
    { date: '15/05/2024', type: 'New Subscription', amount: '₹ 15,000' },
];

const DUMMY_PAYMENTS = [
  {
    date: "25/09/2024",
    type: "Trader - Quarterly Subscription",
    amount: "₹ 45,000",
    mode: "UPI",
    status: "Success",
  },
  {
    date: "15/07/2024",
    type: "Investor - Monthly Subscription",
    amount: "₹ 18,000",
    mode: "Card",
    status: "Success",
  },
  {
    date: "01/06/2024",
    type: "Trial Activation",
    amount: "₹ 1,000",
    mode: "UPI",
    status: "Success",
  },
  {
    date: "05/04/2024",
    type: "Extended Trial Renewal",
    amount: "₹ 800",
    mode: "Bank Transfer",
    status: "Failed",
  },
  {
    date: "10/02/2024",
    type: "Investor - Yearly Subscription",
    amount: "₹ 1,20,000",
    mode: "UPI",
    status: "Success",
  },
];

const DUMMY_DOCUMENTS = [
    { name: 'Aadhaar Card', icon: User },
    { name: 'PAN Card', icon: FileText },
    { name: 'Passport Photo', icon: File },
    { name: 'Client Signature', icon: Edit },
    { name: 'Agreement Copy (PDF)', icon: Layers },
];

const DUMMY_INVOICE = {
    invoiceNo: 'RAI/11/2025/00001',
    date: '15/07/2024',
    client: DUMMY_CLIENT.name,
    email: DUMMY_CLIENT.email,
    contact: DUMMY_CLIENT.contact,
    items: [
        { description: 'Trader Premium Subscription (3 months)', plan: 'Trader Premium', amount: 15000, gstType: 'CGST/SGST', gstPercent: 18 },
    ],
    companyName: 'Raistocks.',
    // companyAddress: '123, Financial District, Mumbai - 400001, India',
    companyLogo: 'https://raistocks.com/wp-content/uploads/2025/05/RAI_logo_180x120-without-background-1.png',
};


// --- BADGE UTILITIES (Duplicated for self-containment) ---
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

// --- TAB CONTENTS ---



const PaymentTab = () => (
 <div className="table-responsive">
    <table className="table table-sm table-bordered table-hover mb-0 crm-table">
      <thead className="table-light">
        <tr>
          <th>Date</th>
          <th>Type of Sale</th>
          <th>Amount Received</th>
          <th>Payment Mode</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {DUMMY_PAYMENTS.map((payment, index) => (
          <tr key={index}>
            <td className="small text-muted">{payment.date}</td>
            <td>{payment.type}</td>
            <td className="fw-semibold text-success">{payment.amount}</td>
            <td>{payment.mode}</td>
            <td>
              <span
                className={`badge rounded-pill bg-${
                  payment.status === "Success" ? "success" : "danger"
                }`}
              >
                {payment.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const InvoiceTab = () => {
  const item = DUMMY_INVOICE.items[0];
  const clientState = "Chhattisgarh"; // or dynamically detect from client address later

  const isCG = clientState === "Chhattisgarh";
  const baseAmount = item.amount;
  const gstPercent = 18;

  const gstBreakup = isCG
    ? [
        { label: "CGST (9%)", value: baseAmount * 0.09 },
        { label: "SGST (9%)", value: baseAmount * 0.09 },
      ]
    : [{ label: "IGST (18%)", value: baseAmount * 0.18 }];

  const totalGST = gstBreakup.reduce((sum, g) => sum + g.value, 0);
  const grandTotal = baseAmount + totalGST;

  return (
    <div className="p-4 p-md-5 bg-white border rounded-3 shadow-sm invoice-layout-card">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
        <div>
          <img
            src={DUMMY_INVOICE.companyLogo}
            alt="Company Logo"
            style={{ height: 60 }}
            className="mb-2"
          />
          <h4 className="fw-bold mb-0 text-primary">Raistocks.com</h4>
          <p className="small mb-0 text-muted">
            GSTIN: <strong>22FNBPS4078F1ZY</strong>
          </p>
          <p className="small text-muted mb-0">
            Email: info@raistocks.com | Website: www.raistocks.com
          </p>
        </div>
        <div className="text-end">
          <h1 className="text-uppercase text-primary fw-bolder mb-1">
            Invoice
          </h1>
          <p className="mb-0">
            Invoice No: <strong>{DUMMY_INVOICE.invoiceNo}</strong>
          </p>
          <p className="mb-0">
            Date: <strong>{DUMMY_INVOICE.date}</strong>
          </p>
        </div>
      </div>

      {/* Client Info */}
      <div className="mb-5">
        <h6 className="text-uppercase text-muted small mb-3">Billed To:</h6>
        <p className="fw-semibold mb-1">{DUMMY_INVOICE.client}</p>
        <p className="small text-muted mb-1">Email: {DUMMY_INVOICE.email}</p>
        <p className="small text-muted mb-1">Contact: {DUMMY_INVOICE.contact}</p>
        <p className="small text-muted mb-0">
          Client GST No: <strong>NA</strong>
        </p>
        <p className="small text-muted mt-1">
          Billing State: <strong>{clientState}</strong>
        </p>
      </div>

      {/* Invoice Table */}
      <div className="table-responsive mb-5">
        <table className="table table-bordered table-striped mb-0">
          <thead className="table-primary">
            <tr>
              <th className="col-6">Description</th>
              <th className="col-1">Plan</th>
              <th className="col-2 text-end">Amount</th>
              <th className="col-1">GST Type</th>
              <th className="col-1">GST %</th>
              <th className="col-1 text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{item.description}</td>
              <td>{getSubscriptionBadge(item.plan)}</td>
              <td className="text-end">₹ {baseAmount.toLocaleString("en-IN")}</td>
              <td>{isCG ? "CGST + SGST" : "IGST"}</td>
              <td>{gstPercent}%</td>
              <td className="text-end fw-semibold">
                ₹ {grandTotal.toLocaleString("en-IN")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* GST Breakdown + Total */}
      <div className="row justify-content-end">
        <div className="col-12 col-md-6 col-lg-4">
          <table className="table table-sm table-borderless text-end">
            <tbody>
              <tr>
                <td className="fw-normal">Sub Total:</td>
                <td className="fw-semibold">
                  ₹ {baseAmount.toLocaleString("en-IN")}
                </td>
              </tr>
              {gstBreakup.map((g, i) => (
                <tr key={i}>
                  <td className="fw-normal">{g.label}:</td>
                  <td className="fw-semibold">
                    ₹ {g.value.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
              <tr className="table-light">
                <td className="fw-bold fs-5 text-primary">Grand Total:</td>
                <td className="fw-bolder fs-5 text-primary">
                  ₹ {grandTotal.toLocaleString("en-IN")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-4 border-top pt-3">
        <p className="small text-muted mb-1">
          This is a system-generated invoice. No signature required.
        </p>
        <button className="btn btn-lg btn-success">
          <Download size={20} className="me-2" /> Download Invoice (PDF)
        </button>
      </div>
    </div>
  );
};


const ClientDocumentsTab = () => (
    <div className="row g-4">
        {DUMMY_DOCUMENTS.map((doc, index) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
                <div className="card h-100 shadow-sm border-0 document-card">
                    <div className="card-body d-flex flex-column align-items-start">
                        <doc.icon className="text-primary mb-2" size={32} />
                        <h6 className="card-title mb-3 fw-bold">{doc.name}</h6>
                        <div className="d-flex mt-auto">
                            <button className="btn btn-sm btn-outline-info me-2">
                                <Eye size={16} className="me-1" /> View
                            </button>
                            <button className="btn btn-sm btn-outline-success">
                                <Download size={16} className="me-1" /> Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);


// --- CLIENT ALL DETAILS COMPONENT ---
const ClientAllDetails = ({ onBackToClients }) => {
    const [activeTab, setActiveTab] = useState('Payment');
 
    const renderTabContent = () => {
        switch (activeTab) {
            case 'Sales': return <SalesTab />;
            case 'Payment': return <PaymentTab />;
            case 'Invoice': return <InvoiceTab />;
            case 'Client Documents': return <ClientDocumentsTab />;
            default: return null;
        }
    };


    return (
        <div className="crm-container">
            {/* Back Button */}
            <button className="btn btn-outline-secondary btn-sm mb-3 back-btn-shadow" >
                &larr; Back to Clients List
            </button>

            {/* Client Summary Card */}
            <div className="card shadow-sm rounded-3 border-0 mb-4 p-4 border-start border-5 border-info summary-card">
                <div className="card-body p-0">
                    <h3 className="card-title mb-3 fw-bold">{DUMMY_CLIENT.name} <span className="small text-muted fw-normal">| RAI25OCT120001</span></h3>
                    <div className="row g-3">
                        {/* Row 1: Contact and IDs */}
                        <div className="col-sm-6 col-lg-3">
                            <p className="small text-muted mb-0">Email</p>
                            <h6 className="mb-0 fw-semibold">{DUMMY_CLIENT.email}</h6>
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <p className="small text-muted mb-0">Contact / WhatsApp</p>
                            <h6 className="mb-0 fw-semibold"><IoMdCall className="me-2" />{DUMMY_CLIENT.contact}</h6>
                            <h6 className="mb-0 fw-semibold"><FaWhatsapp className='me-2'/>{DUMMY_CLIENT.contact}</h6>
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <p className="small text-muted mb-0">Aadhaar</p>
                            <h6 className="mb-0 fw-semibold">{DUMMY_CLIENT.aadhaar}</h6>
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <p className="small text-muted mb-0">PAN</p>
                            <h6 className="mb-0 fw-semibold">{DUMMY_CLIENT.pan}</h6>
                        </div>
                    </div>

                    <div className="row g-3 mt-3 pt-3 border-top">
                        {/* Row 2: Subscription Details */}
                        <div className="col-6 col-md-3 col-lg-2">
                            <p className="small text-muted mb-1">Subscription Type</p>
                            {getSubscriptionBadge(DUMMY_CLIENT.subscription)}
                        </div>
                        <div className="col-6 col-md-3 col-lg-2">
                            <p className="small text-muted mb-1">Subscribed Plan</p>
                            <h6 className="mb-0 fw-semibold">{DUMMY_CLIENT.plan}</h6>
                        </div>
                        <div className="col-6 col-md-3 col-lg-2">
                            <p className="small text-muted mb-1">Validity</p>
                            <div className='small'>
                                <span className='text-nowrap'>From: {DUMMY_CLIENT.periodFrom}</span> /
                                <span className='text-nowrap'> To: {DUMMY_CLIENT.periodTo}</span>
                            </div>
                        </div>
                        <div className="col-6 col-md-3 col-lg-2">
                            <p className="small text-muted mb-1">Days Left</p>
                            {getDaysLeftBadge(DUMMY_CLIENT.daysLeft)}
                        </div>
                        <div className="col-6 col-md-3 col-lg-2">
                            <p className="small text-muted mb-1">KYC Status</p>
                            {getKycBadge(DUMMY_CLIENT.kycStatus)}
                        </div>
                      
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="card shadow-sm rounded-3 border-0">
                <div className="card-header p-0 bg-white">
                    <ul className="nav nav-tabs crm-nav-tabs" role="tablist">
                        {['Payment', 'Invoice', 'Client Documents'].map(tab => (
                            <li className="nav-item" key={tab}>
                                <a
                                    className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                                    onClick={(e) => { e.preventDefault(); setActiveTab(tab); }}
                                    data-bs-toggle="tab"
                                    href={`#${tab.toLowerCase().replace(' ', '-')}`}
                                    role="tab"
                                >
                                    {tab}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="card-body p-4">
                    <div className="tab-content">
                        <div className="tab-pane active" role="tabpanel">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientAllDetails;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  User,
  FileText,
  File,
  Edit,
  Layers,
  Eye,
  Download,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
import InvoiceModal from "../InvoiceModal";
import { useDispatch, useSelector } from "react-redux";
import { uploadAgreement } from "../../slices/kycSlice";
import { updateKycStatus, fetchClients } from "../../slices/clientSlice";

const API_URL = import.meta.env.VITE_API_URL;

// --- BADGE UTILITIES ---
const getSubscriptionBadge = (sub) => {
  let color;
  switch (sub) {
    case "Trial":
      color = "secondary";
      break;
    case "Extended Trial":
      color = "warning";
      break;
    case "Investor":
      color = "info";
      break;
    case "Trader":
      color = "primary";
      break;
    case "Trader Premium":
      color = "success";
    case "Custom":
      color = "success";
      break;
    default:
      color = "light";
  }
  return <span className={`badge bg-${color} rounded-pill`}>{sub}</span>;
};

const getKycBadge = (status) => {
  let color;
  switch (status) {
    case "Pending":
      color = "warning";
      break;
    case "Approved":
      color = "success";
      break;
    case "Rejected":
      color = "danger";
      break;
    default:
      color = "light";
  }
  return <span className={`badge bg-${color} rounded-pill`}>{status}</span>;
};

const getDaysLeftBadge = (days) => {
  let color = "success";
  if (days === 0) color = "danger";
  else if (days < 10) color = "warning";
  return <span className={`badge bg-${color} rounded-pill`}>{days} Days</span>;
};

// --- CLIENT DOCUMENTS TAB ---
const ClientDocumentsTab = ({ kycData }) => {
  const dispatch = useDispatch();
  const documents = [
    { name: "Aadhaar Front", url: kycData?.aadhaar_front_url, icon: User },
    { name: "Aadhaar Back", url: kycData?.aadhaar_back_url, icon: User },
    { name: "PAN Card", url: kycData?.pan_image_url, icon: FileText },
    { name: "Photo", url: kycData?.your_photo_url, icon: File },
    { name: "Signature", url: kycData?.your_signature_url, icon: Edit },
    { name: "Agreement", url: kycData?.agreement_url, icon: Edit },
  ];
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(kycData?.agreement_url || null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Temporary preview
  };

  // const handleUpload = async () => {
  //   if (!selectedFile) return alert("Please select a file to upload!");
  //   setUploading(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append("agreement", selectedFile);

  //     await dispatch(
  //       uploadAgreement({ id: kycData._id, agreementFile: selectedFile })
  //     ).unwrap();

  //     alert("Agreement uploaded successfully!");
  //     setSelectedFile(null);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to upload agreement");
  //   } finally {
  //     setUploading(false);
  //   }
  // };
  return (
    <div className="row g-4">
      {documents.map((doc, index) => (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
          <div className="card h-100 shadow-sm border-0 document-card">
            <div className="card-body d-flex flex-column align-items-start">
              <doc.icon className="text-primary mb-2" size={32} />
              <h6 className="card-title mb-3 fw-bold">{doc.name}</h6>
              <div className="d-flex mt-auto">
                {doc.url ? (
                  <>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-info me-2"
                    >
                      <Eye size={16} className="me-1" /> View
                    </a>
                    <a
                      href={doc.url}
                      download
                      className="btn btn-sm btn-outline-success"
                    >
                      <Download size={16} className="me-1" /> Download
                    </a>
                  </>
                ) : (
                  <span className="text-muted small">Not uploaded</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- AGREEMENT TAB ---
// --- AGREEMENT TAB (UI ONLY) ---
const AgrementTab = ({ kycData }) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(kycData?.agreement_url || null);
  const [uploading, setUploading] = useState(false);
  const { clientId } = useParams();
   console.log(kycData)
  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Temporary preview
  };
  // const handleUpload = async () => {
  //   if (!selectedFile) return alert("Please select a file to upload!");
  //   setUploading(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append("agreement", selectedFile);

  //     await dispatch(
  //       uploadAgreement({ id: kycData._id, agreementFile: selectedFile })
  //     ).unwrap();

  //     alert("Agreement uploaded successfully!");
  //     setSelectedFile(null);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to upload agreement");
  //   } finally {
  //     setUploading(false);
  //   }
  // };
const handleUpload = async () => {
  if (!selectedFile) return alert("Please select a file to upload!");
  setUploading(true);

  try {
    const formData = new FormData();
    formData.append("agreement", selectedFile);

    // 1️⃣ Upload agreement
    await dispatch(
      uploadAgreement({ id: kycData._id, agreementFile: selectedFile })
    ).unwrap();

    // 2️⃣ If upload success → update KYC status
    await dispatch(
      updateKycStatus({
        clientId: clientId,
        kyc: "Approved",
      })
    ).unwrap();

    alert("Agreement uploaded & KYC updated successfully!");
    setSelectedFile(null);

  } catch (err) {
    console.error(err);
    alert("Failed to upload agreement or update KYC");
  } finally {
    setUploading(false);
  }
};

  return (
    <div className="row g-4">
      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div className="card h-100 shadow-sm border-0 document-card">
          <div className="card-body d-flex flex-column align-items-start">
            <FileText className="text-primary mb-2" size={32} />
            <h6 className="card-title mb-3 fw-bold">Agreement Document</h6>

            {/* FILE INPUT */}
            <input
              type="file"
              accept="application/pdf,image/*"
              className="form-control mb-3"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />

            {/* VIEW + DOWNLOAD BUTTONS */}
            <div className="d-flex mb-3">
              {previewUrl ? (
                <>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-info me-2"
                  >
                    <Eye size={16} className="me-1" /> View
                  </a>
                  <a
                    href={previewUrl}
                    download={selectedFile?.name || "agreement"}
                    className="btn btn-sm btn-outline-success"
                  >
                    <Download size={16} className="me-1" /> Download
                  </a>
                </>
              ) : (
                <span className="text-muted small">No Agreement Uploaded</span>
              )}
            </div>

            {/* UPLOAD BUTTON */}
            <button
              className="btn btn-sm btn-primary"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Agreement"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// --- MAIN COMPONENT ---
const ClientAllDetails = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const [clientData, setClientData] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [kycData, setKycData] = useState(null); // <-- added KYC state
  const [activeTab, setActiveTab] = useState("Payment");
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleOpenInvoiceModal = async (invoiceId) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/invoice/${invoiceId}`);
      setInvoiceData(data);
      setShowInvoiceModal(true);
    } catch (err) {
      console.error("Error fetching invoice:", err);
      alert("Failed to load invoice");
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // 1) FETCH CLIENT
        const clientRes = await axios.get(`${API_URL}/api/clients/${clientId}`);
        setClientData(clientRes.data);

        // 2) FETCH INVOICE USING invoiceId
        if (clientRes.data.invoiceId) {
          const encodedInvoiceId = encodeURIComponent(clientRes.data.invoiceId);
          const invoiceRes = await axios.get(
            `${API_URL}/api/invoice/${encodedInvoiceId}`
          );
          setInvoiceData(invoiceRes.data);
        }

        // 3) FETCH KYC USING CLIENT EMAIL
        if (clientRes.data.email) {
          const kycRes = await axios.get(
            `${API_URL}/api/kyc/email/${clientRes.data.email}`
          );
          setKycData(kycRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching client details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [clientId]);

  if (loading)
    return (
      <div className="text-center p-5 fw-bold text-muted">
        Loading client details...
      </div>
    );
  if (!clientData)
    return <div className="text-center p-5 text-danger">No client found!</div>;

  // --- PAYMENT TAB ---
  // const PaymentTab = () => {
  //   if (!clientData.paymentHistory || clientData.paymentHistory.length === 0) {
  //     return (
  //       <div className="text-center text-muted py-3">
  //         No payment history found.
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="table-responsive">
  //       <table className="table table-sm table-bordered table-hover mb-0 crm-table">
  //         <thead className="table-light">
  //           <tr>
  //             <th>Date</th>
  //             <th>Plan</th>
  //             <th>Amount</th>
  //             <th>Payment Mode</th>
  //             <th>Status</th>
  //           </tr>
  //         </thead>

  //         <tbody>
  //           {clientData.paymentHistory.map((pay, index) => (
  //             <tr key={index}>
  //               <td>{new Date(pay.date).toLocaleDateString()}</td>

  //               <td>
  //                 {clientData.subscription} ({clientData.planType})
  //               </td>

  //               <td className="fw-semibold text-success">₹ {pay.amount}</td>

  //               <td>{pay.method}</td>

  //               <td>
  //                 <span
  //                   className={`badge rounded-pill bg-${
  //                     pay.status === "Success" ? "success" : "danger"
  //                   }`}
  //                 >
  //                   {pay.status}
  //                 </span>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  // };
  const PaymentTab = () => {
    if (!clientData.paymentHistory || clientData.paymentHistory.length === 0) {
      return (
        <div className="text-center text-muted py-3">
          No payment history found.
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <table className="table table-sm table-bordered table-hover mb-0 crm-table">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Payment Mode</th>
              <th>Status</th>
              <th>Invoice</th>
            </tr>
          </thead>

          <tbody>
            {clientData.paymentHistory.map((pay, index) => (
              <tr key={index}>
                <td>{new Date(pay.date).toLocaleDateString()}</td>

                <td>
                  {clientData.subscription} ({clientData.planType})
                </td>

                <td className="fw-semibold text-success">₹ {pay.amount}</td>

                <td>{pay.method}</td>

                <td>
                  <span
                    className={`badge rounded-pill bg-${
                      pay.status === "Success" ? "success" : "danger"
                    }`}
                  >
                    {pay.status}
                  </span>
                </td>

                {/* --- INVOICE BUTTON HERE --- */}
                <td className="text-center">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      handleOpenInvoiceModal(encodeURIComponent(pay.invoiceId))
                    }
                  >
                    <FileText size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Invoice Modal */}
        <InvoiceModal
          show={showInvoiceModal}
          handleClose={() => setShowInvoiceModal(false)}
          invoiceData={invoiceData}
        />
      </div>
    );
  };

  // --- INVOICE TAB ---
  const InvoiceTab = () => {
    if (!invoiceData)
      return <div className="text-center text-muted">No invoice found</div>;

    const item = invoiceData.items[0];
    return (
      <div className="text-center">
        <button
          className="btn btn-primary"
          onClick={() => setShowInvoiceModal(true)}
        >
          View Invoice
        </button>

        {/* Modal Render */}
        <InvoiceModal
          show={showInvoiceModal}
          handleClose={() => setShowInvoiceModal(false)}
          invoiceData={invoiceData}
        />
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Payment":
        return <PaymentTab />;
      case "Invoice":
        return <InvoiceTab />;
      case "Client Documents":
        return <ClientDocumentsTab kycData={kycData} />;
      case "Agrement Upload":
        return <AgrementTab kycData={kycData} />;
      default:
        return null;
    }
  };

  return (
    <div className="crm-container">
      {/* Back Button */}
      <button
        className="btn btn-outline-secondary btn-sm mb-3 back-btn-shadow"
        onClick={() => navigate("/admin/clients")}
      >
        &larr; Back to Clients List
      </button>

      {/* Client Summary */}
      <div className="card shadow-sm rounded-3 border-0 mb-4 p-4 border-start border-5 border-info summary-card">
        <div className="card-body p-0">
          <h3 className="card-title mb-3 fw-bold">
            {clientData.name}{" "}
            <span className="small text-muted fw-normal">
              | {clientData.clientId}
            </span>
          </h3>
          <div className="row g-3">
            <div className="col-sm-6 col-lg-3">
              <p className="small text-muted mb-0">Email</p>
              <h6 className="mb-0 fw-semibold">{clientData.email}</h6>
            </div>
            <div className="col-sm-6 col-lg-3">
              <p className="small text-muted mb-0">Contact / WhatsApp</p>
              <h6 className="mb-0 fw-semibold">
                <IoMdCall className="me-2" />
                {clientData.phone}
              </h6>
              <h6 className="mb-0 fw-semibold">
                <FaWhatsapp className="me-2" />
                {clientData.phone}
              </h6>
            </div>
            <div className="col-sm-6 col-lg-3">
              <p className="small text-muted mb-0">PAN</p>
              <h6 className="mb-0 fw-semibold">{clientData.pan}</h6>
            </div>
            <div className="col-sm-6 col-lg-3">
              <p className="small text-muted mb-0">State</p>
              <h6 className="mb-0 fw-semibold">{clientData.state}</h6>
            </div>
          </div>

          <div className="row g-3 mt-3 pt-3 border-top">
            <div className="col-6 col-md-3 col-lg-2">
              <p className="small text-muted mb-1">Subscription</p>
              {getSubscriptionBadge(clientData.subscription)}
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <p className="small text-muted mb-1">Plan Type</p>
              <h6 className="mb-0 fw-semibold">{clientData.planType}</h6>
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <p className="small text-muted mb-1">Days Left</p>
              {getDaysLeftBadge(clientData.daysLeft)}
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <p className="small text-muted mb-1">KYC</p>
              {getKycBadge(clientData.kyc)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card shadow-sm rounded-3 border-0">
        <div className="card-header p-0 bg-white">
          <ul className="nav nav-tabs crm-nav-tabs" role="tablist">
            {["Payment", "Client Documents", "Agrement Upload"].map((tab) => (
              <li className="nav-item" key={tab}>
                <a
                  className={`nav-link ${activeTab === tab ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab);
                  }}
                  href="#"
                >
                  {tab}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-body p-4">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ClientAllDetails;

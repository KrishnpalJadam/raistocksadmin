// ResearchReportAdd.jsx
import React, { useState } from "react";
import { FileText, Download } from "lucide-react";
import { Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const ResearchReportAdd = () => {
  // --- DUMMY RESEARCH REPORT DATA ---
  const dummyReports = [
    {
      id: 1,
      title: "Sector Deep Dive: The Indian Auto Ancillary Sector (Q3 FY26)",
      filename: "AutoAncillary_Q3FY26_DeepDive.pdf",
      date: "October 1, 2025",
      size: "1.2 MB",
      type: "Sectoral",
      link: "/reports/auto_ancillary_report.pdf",
    },
    {
      id: 2,
      title: "Q2 Earnings Preview: Banking and Financial Services",
      filename: "Q2_Banking_Preview.pdf",
      date: "September 28, 2025",
      size: "750 KB",
      type: "Earnings",
      link: "/reports/q2_banking_preview.pdf",
    },
    {
      id: 3,
      title: "Long Term Idea: Power Grid Corporation of India Ltd. (Buy)",
      filename: "POWERGRID_LongTerm_Idea.pdf",
      date: "September 25, 2025",
      size: "450 KB",
      type: "Stock Specific",
      link: "/reports/powergrid_report.pdf",
    },
    {
      id: 4,
      title: "Commodity Outlook: Crude Oil and Gold Price Projections",
      filename: "Commodity_Outlook_Q4_FY26.pdf",
      date: "September 20, 2025",
      size: "980 KB",
      type: "Macro",
      link: "/reports/commodity_outlook.pdf",
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [newReport, setNewReport] = useState({
    title: "",
    description: "",
    file: null,
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setNewReport({
      ...newReport,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Report:", newReport);
    // You can handle upload or API call here
    handleClose();
  };

  const getIconColor = (type) => {
    switch (type) {
      case "Sectoral":
        return "#007bff";
      case "Earnings":
        return "#198754";
      case "Stock Specific":
        return "#ffc107";
      case "Macro":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  return (
    <div className="rai-module-content p-3">
      <div className="d-flex justify-content-between mb-4">
        <h4 className="fw-semibold">Investment Research Reports</h4>
        <button className="btn btn-primary" onClick={handleShow}>
          Add Report
        </button>
      </div>

      <div className="list-group">
        {dummyReports.map((report) => (
          <div
            key={report.id}
            className="list-group-item repot list-group-item-action d-flex justify-content-between align-items-center rai-report-item"
          >
            <div className="d-flex align-items-center">
              <div
                className="rai-icon-bg me-3 d-flex justify-content-center align-items-center"
                style={{
                  backgroundColor: `${getIconColor(report.type)}15`,
                  minWidth: "40px",
                  height: "40px",
                  borderRadius: "8px",
                }}
              >
                <FileText size={20} color={getIconColor(report.type)} />
              </div>
              <div>
                <h5 className="mb-0 fw-bold" style={{ fontSize: "1rem" }}>
                  {report.title}
                </h5>
                <p className="text-muted mb-0 small">
                  {report.filename} ({report.type} Report)
                </p>
              </div>
            </div>

            <div className="d-flex align-items-center flex-shrink-0">
              <div className="text-end me-4 d-none d-md-block">
                <span className="d-block small text-muted">
                  Date: {report.date}
                </span>
              </div>

              <a
                href={report.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm d-flex align-items-center"
                download={report.filename}
              >
                <Download size={16} className="me-1" /> Open/Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* ADD REPORT MODAL */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Research Report</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Report Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newReport.title}
                onChange={handleChange}
                placeholder="Enter report title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Short Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newReport.description}
                onChange={handleChange}
                placeholder="Enter short description"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Attach File</Form.Label>
              <Form.Control
                type="file"
                name="file"
                accept=".pdf,.docx"
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Report
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ResearchReportAdd;
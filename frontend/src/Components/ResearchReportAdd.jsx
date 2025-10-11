import React, { useState, useEffect } from "react";
import { FileText, Download, Trash2 } from "lucide-react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchReports, uploadReport } from "../slices/researchReportSlice";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ResearchReportAdd = () => {
  const dispatch = useDispatch();
  const { items: reports = [], status } = useSelector((s) => s.researchReports || { items: [] });

  const [showModal, setShowModal] = useState(false);
  const [newReport, setNewReport] = useState({ title: "", description: "", file: null });

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setNewReport({ ...newReport, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReport.file) return;
    const formData = new FormData();
    formData.append("title", newReport.title);
    formData.append("description", newReport.description);
    formData.append("file", newReport.file);

    try {
      await dispatch(uploadReport(formData)).unwrap();
      // refresh list
      dispatch(fetchReports());
      setNewReport({ title: "", description: "", file: null });
      handleClose();
    } catch (err) {
      // keep simple: console error
      console.error("Upload failed", err);
    }
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
        {status === "loading" && <div className="text-muted">Loading...</div>}
        {reports.map((report) => (
          <div
            key={report._id || report.id}
            className="list-group-item repot list-group-item-action d-flex justify-content-between align-items-center rai-report-item"
          >
            <div className="d-flex align-items-center">
              <div
                className="rai-icon-bg me-3 d-flex justify-content-center align-items-center"
                style={{
                  backgroundColor: `${getIconColor(report.type || "") }15`,
                  minWidth: "40px",
                  height: "40px",
                  borderRadius: "8px",
                }}
              >
                <FileText size={20} color={getIconColor(report.type || "")} />
              </div>
              <div>
                <h5 className="mb-0 fw-bold" style={{ fontSize: "1rem" }}>
                  {report.title}
                </h5>
                <p className="text-muted mb-0 small">{report.description}</p>
              </div>
            </div>

            <div className="d-flex align-items-center flex-shrink-0">
              <div className="text-end me-4 d-none d-md-block">
                <span className="d-block small text-muted">
                  {report.createdAt ? new Date(report.createdAt).toLocaleString() : ""}
                </span>
              </div>

              <a
                href={`${API_BASE}/api/research-reports/download/${report._id || report.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm d-flex align-items-center me-2"
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
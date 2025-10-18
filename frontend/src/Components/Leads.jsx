import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeads,
  updateLeadStatus,
  deleteLead,
} from "../slices/leadSlice"; // adjust path if needed
import {
  Card,
  Table,
  Button,
  Form,
  Row,
  Col,
  Pagination,
  Modal,
} from "react-bootstrap";
import { Search, Trash, Plus } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const statusOptions = [
  { label: "All", color: "light" },
  { label: "New Lead", color: "secondary" },
  { label: "Contacted", color: "warning text-dark" },
  { label: "Qualified", color: "primary" },
  { label: "Converted", color: "success" },
];

const Leads = () => {
  const dispatch = useDispatch();
  const { leads, loading, error } = useSelector((state) => state.leads);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal / Add lead state
  const [showModal, setShowModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    contact: "",
    source: "Web",
  });

  // Fetch leads on mount
  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);
 const fileInputRef = useRef(null);

  // jab button click ho
  const handleButtonClick = () => {
    fileInputRef.current.click(); // file input open karega
  };

   // jab file select ho
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
      // yahan aap CSV import logic likh sakte ho
    }
  };

  // Filtered leads (search + status)
  const filteredLeads = useMemo(() => {
    if (!Array.isArray(leads)) return [];
    return leads.filter((lead) => {
      const searchMatch =
        (lead.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (lead.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.contact || lead.phone || "")
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const statusMatch = statusFilter === "All" || lead.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [leads, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLeads, currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= (totalPages || 1)) {
      setCurrentPage(pageNumber);
    }
  };

  // Update status - optimistic in Redux, then try to persist to backend
  const handleStatusChange = async (id, newStatus) => {
    // Optmistic UI update via reducer action
    dispatch(updateLeadStatus({ id, status: newStatus }));

    try {
      const token = import.meta.env.VITE_ADMIN_TOKEN;
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/leads/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        // revert / refresh from server to maintain consistency
        await dispatch(fetchLeads());
        const text = await res.text();
        throw new Error(text || "Failed to update status on server");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Could not update status on server. Changes reverted.");
      dispatch(fetchLeads());
    }
  };

  // Delete lead (call backend then update Redux)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      const token = import.meta.env.VITE_ADMIN_TOKEN;
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/leads/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete lead on server");
      }

      // remove from Redux state
      dispatch(deleteLead(id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete lead on server.");
      // Refresh to keep UI consistent
      dispatch(fetchLeads());
    }
  };

  // Add new lead (POST to backend then refresh list)
  const handleAddLead = async () => {
    if (!newLead.name || !newLead.email || !newLead.contact) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setAdding(true);
      const token = import.meta.env.VITE_ADMIN_TOKEN;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newLead.name,
          email: newLead.email,
          contact: newLead.contact,
          source: newLead.source,
          status: "New Lead",
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create lead");
      }

      // refresh list from server
      await dispatch(fetchLeads());

      // reset and close modal
      setNewLead({ name: "", email: "", contact: "", source: "Web" });
      setShowModal(false);
    } catch (err) {
      console.error("Add lead error:", err);
      alert("Failed to add lead. See console for details.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="page-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">📈 Leads Management</h2>
       
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={18} className="me-2" /> Add Lead
        </Button>
      </div>

      <Card className="mt-4">
        <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0">All Leads</h5>
          {/* hidden file input */}
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* visible button */}
      <Button
        variant="success"
        className="btn btn-success btn-sm"
        onClick={handleButtonClick}
      >
        <Plus size={18} className="me-1" /> Import CSV
      </Button>
        </Card.Header>

        <Card.Body>
          {/* Filters */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group className="d-flex">
                <Search className="lucide-icon me-2 mt-2 text-secondary" />
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Select
                size="sm"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.label} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={4} className="d-flex align-items-center justify-content-end">
              <span className="text-muted small">
                Showing {paginatedLeads.length} of {filteredLeads.length} leads
              </span>
            </Col>
          </Row>

          {/* Loading / Error */}
          {loading && <p>Loading leads...</p>}
          {error && <p className="text-danger">Error: {error}</p>}

          {/* Leads Table */}
          {!loading && (
            <Table responsive hover className="align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name / Email</th>
                  <th>Contact</th>
                  <th>Date Added</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeads.length > 0 ? (
                  paginatedLeads.map((lead, index) => {
                    const currentStatus = statusOptions.find(
                      (s) => s.label === lead.status
                    );
                    return (
                      <tr key={lead._id || index}>
                        <td>{index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}</td>
                        <td>
                          <strong>{lead.name}</strong>
                          <br />
                          <small className="text-muted">{lead.email}</small>
                        </td>
                        <td>{lead.contact || lead.phone || "—"}</td>
                        <td>
                          {lead.createdAt
                            ? new Date(lead.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>
                          <Form.Select
                            size="sm"
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead._id, e.target.value)
                            }
                            style={{
                              border: "none",
                              backgroundColor: `var(--bs-${currentStatus?.color?.split(" ")[0]
                                })`,
                              color: currentStatus?.color?.includes("text-dark")
                                ? "#000"
                                : "#fff",
                              fontWeight: 600,
                              borderRadius: "6px",
                              textAlign: "center",
                              width: "150px",
                            }}
                          >
                            {statusOptions
                              .filter((opt) => opt.label !== "All")
                              .map((opt) => (
                                <option key={opt.label} value={opt.label}>
                                  {opt.label}
                                </option>
                              ))}
                          </Form.Select>
                        </td>
                        <td>{lead.source || "—"}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(lead._id)}
                          >
                            <Trash size={16} /> Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      No leads found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages || 0)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={idx + 1 === currentPage}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              />
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              />
            </Pagination>
          </div>
        </Card.Body>
      </Card>

      {/* Add Lead Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Lead</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={newLead.name}
                onChange={(e) =>
                  setNewLead((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={newLead.email}
                onChange={(e) =>
                  setNewLead((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter contact number"
                value={newLead.contact}
                onChange={(e) =>
                  setNewLead((prev) => ({ ...prev, contact: e.target.value }))
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Source</Form.Label>
              <Form.Select
                value={newLead.source}
                onChange={(e) =>
                  setNewLead((prev) => ({ ...prev, source: e.target.value }))
                }
              >
                <option value="Web">Web</option>
                <option value="Reference">Reference</option>
                <option value="Add">Add</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddLead} disabled={adding}>
            {adding ? "Adding..." : "Add Lead"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Leads;

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeads, updateLeadStatus, deleteLead } from "../slices/leadSlice";
import { Card, Table, Button, Form, Row, Col, Pagination } from "react-bootstrap";
import { Search, Trash } from "lucide-react";

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

  // ✅ Fetch leads when component loads
  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateLeadStatus({ id, status: newStatus }));
    // Optionally send PUT/PATCH request to backend here
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      dispatch(deleteLead(id));
      // Optionally send DELETE request to backend here
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchMatch =
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.contact?.toLowerCase().includes(searchTerm.toLowerCase());
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
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="page-content">
      <h2 className="mb-4">📈 Leads Management</h2>

      <Card className="mt-4">
        <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0">All Leads</h5>
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

          {/* Loading/Error States */}
          {loading && <p>Loading leads...</p>}
          {error && <p className="text-danger">Error: {error}</p>}

          {/* Table */}
          {!loading && (
            <Table responsive hover className="align-middle">
              <thead>
                <tr>
                  <th>#ID</th>
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
                        <td>{(index + 1) + (currentPage - 1) * ITEMS_PER_PAGE}</td>
                        <td>
                          <strong>{lead.name}</strong>
                          <br />
                          <small className="text-muted">{lead.email}</small>
                        </td>
                        <td>{lead.contact}</td>
                        <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Form.Select
                            size="sm"
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead._id, e.target.value)
                            }
                            style={{
                              border: "none",
                              backgroundColor: `var(--bs-${
                                currentStatus?.color?.split(" ")[0]
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
                        <td>{lead.source}</td>
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
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Leads;

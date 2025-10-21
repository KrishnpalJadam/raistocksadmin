// src/components/Clients/Clients.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchClients } from "../slices/clientSlice"; // ✅ import
import { Card, Table, Button, Form, Row, Col, Pagination, Spinner } from "react-bootstrap";
import { Search, Filter, Pencil } from "lucide-react";
import ClientFormModal from "./ClientFormModal";

const ITEMS_PER_PAGE = 10;

// Helper to get Bootstrap badge class for subscription type
const getSubscriptionBadge = (type) => {
  switch (type) {
    case "Investor":
      return "badge-investor";
    case "Trader":
      return "badge-trader";
    case "Extended Trial":
      return "bg-info text-white";
    default:
      return "badge-trial text-dark";
  }
};

const Clients = () => {
  const dispatch = useDispatch();
  const { clients, loading, error } = useSelector((state) => state.clients);

  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleOpenModal = (client = null) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
  };

  // --- Filtering and Searching Logic ---
  const filteredClients = useMemo(() => {
    if (!clients) return [];
    return clients.filter((client) => {
      const name = client.name || "";
      const email = client.email || "";
      const subscription = client.subscription || "";
      const searchMatch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch =
        filterStatus === "All" || subscription === filterStatus;
      return searchMatch && statusMatch;
    });
  }, [clients, searchTerm, filterStatus]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClients.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredClients, currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="page-content">
      <h2 className="mb-4">👥 Clients Management</h2>

      <Card>
        <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0">All Clients List ({filteredClients.length})</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <div className="text-danger text-center my-5">{error}</div>
          ) : (
            <>
              {/* Search and Filter Row */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="d-flex">
                    <Search className="lucide-icon me-2 mt-2 text-secondary" />
                    <Form.Control
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="d-flex">
                    <Filter className="lucide-icon me-2 mt-2 text-secondary" />
                    <Form.Select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="All">All Subscriptions</option>
                      <option value="Investor">Investor</option>
                      <option value="Trader">Trader</option>
                      <option value="Trial">Trial</option>
                      <option value="Extended Trial">Extended Trial</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col
                  md={3}
                  className="d-flex align-items-center justify-content-end"
                >
                  <span className="text-muted small">
                    Showing {paginatedClients.length} of {filteredClients.length} results
                  </span>
                </Col>
              </Row>

              {/* Clients Table */}
              <Table responsive hover className="align-middle">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>Name / Contact</th>
                    <th>Subscription</th>
                    <th>Days Left</th>
                    <th>KYC</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedClients.length > 0 ? (
                    paginatedClients.map((client, idx) => (
                      <tr key={client._id || idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <strong>{client.name || "-"}</strong>
                          <br />
                          <small className="text-muted">{client.email || "-"}</small>
                        </td>
                        <td>
                          <span
                            className={`badge badge-subscription ${getSubscriptionBadge(
                              client.subscription || "-"
                            )}`}
                          >
                            {client.subscription || "-"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              client.daysLeft > 30
                                ? "success"
                                : client.daysLeft > 0
                                ? "warning"
                                : "danger"
                            }`}
                          >
                            {client.daysLeft ?? "-"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              client.kyc === "Approved"
                                ? "success"
                                : client.kyc === "Pending"
                                ? "warning"
                                : "danger"
                            }`}
                          >
                            {client.kyc || "-"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              client.status === "Active"
                                ? "primary"
                                : "secondary"
                            }`}
                          >
                            {client.status || "-"}
                          </span>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            title="Edit Profile"
                            onClick={() => handleOpenModal(client)}
                          >
                            <Pencil className="lucide-icon" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No clients found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
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
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Client Add/Edit Modal */}
      <ClientFormModal
        show={showModal}
        handleClose={handleCloseModal}
        clientData={editingClient}
      />
    </div>
  );
};

export default Clients;

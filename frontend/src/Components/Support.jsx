// src/components/Support/Support.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Table, Button, Form, Row, Col, Pagination, Badge, Spinner } from "react-bootstrap";
import { Search, Filter, Eye, Mail } from "lucide-react";
import TicketDetailModal from "./TicketDetailModal";
import { fetchSupportTickets, updateTicketStatus } from "../slices/supportSlice";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/support`;
const ITEMS_PER_PAGE = 10;

const getStatusBadge = (status) => {
  switch (status) {
    case "Resolved":
      return "bg-success";
    case "In-progress":
      return "bg-primary";
    case "Open":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
};

const Support = () => {
  const dispatch = useDispatch();
  const { tickets, loading, error } = useSelector((state) => state.support);

  const [showModal, setShowModal] = useState(false);
  const [viewingTicket, setViewingTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Fetch all tickets on mount
  useEffect(() => {
    dispatch(fetchSupportTickets());
  }, [dispatch]);

  // ✅ Handle view details modal
  const handleOpenModal = (ticket) => {
    setViewingTicket(ticket);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setViewingTicket(null);
  };

  // ✅ Handle email click
const handleSendEmail = async (ticket) => {
  try {
    // Prepare mailto URL
    const subject = `Regarding your support ticket #${ticket.ticketId}`;
    const body = `Hi ${ticket.client},\n\nWe’re reaching out regarding your ticket about "${ticket.subject}".\n\nBest regards,\nSupport Team`;
    const mailtoUrl = `mailto:${ticket.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open mail client immediately
    window.open(mailtoUrl, "_blank");

    // ✅ Fetch email from backend (optional, can skip if you already have email)
    const res = await axios.get(`${API_URL}/${ticket._id}/email`);
    const email = res.data.email;

    if (!email) {
      console.warn("Email not found from backend.");
    }

    // Mark ticket as resolved in backend
    await axios.put(`${API_URL}/${ticket._id}/resolve`);

    // Update status in Redux
    dispatch(updateTicketStatus({ id: ticket._id, status: "Resolved" }));
  } catch (err) {
    console.error("Error sending email:", err);
    alert("Failed to update ticket status.");
  }
};


  // ✅ Filter + search tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const searchMatch =
        ticket.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.ticketId.toString().includes(searchTerm);

      const statusMatch = filterStatus === "All" || ticket.status === filterStatus;
      return searchMatch && statusMatch;
    });
  }, [tickets, searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTickets, currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="page-content">
      <h2 className="mb-4">🎟️ Support Tickets</h2>

      <Card>
        <Card.Header className="bg-white border-bottom">
          <h5 className="mb-0">Client Support Tickets List</h5>
        </Card.Header>
        <Card.Body>
          {/* ✅ Search and Filter Row */}
          <Row className="mb-3">
            <Col md={5}>
              <Form.Group className="d-flex">
                <Search className="lucide-icon me-2 mt-2 text-secondary" />
                <Form.Control
                  type="text"
                  placeholder="Search by ticket ID, client, or subject..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="d-flex">
                <Filter className="lucide-icon me-2 mt-2 text-secondary" />
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="In-progress">In-progress</option>
                  <option value="Resolved">Resolved</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-center justify-content-end">
              <span className="text-muted small">
                Showing {paginatedTickets.length} of {filteredTickets.length} tickets
              </span>
            </Col>
          </Row>

          {/* ✅ Tickets Table */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : error ? (
            <div className="text-danger text-center py-5">{error}</div>
          ) : (
            <Table responsive hover className="align-middle">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Client</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Opened</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTickets.length > 0 ? (
                  paginatedTickets.map((ticket) => (
                    <tr key={ticket._id}>
                      <td><strong>{ticket.ticketId}</strong></td>
                      <td>{ticket.client}</td>
                      <td><small>{ticket.subject}</small></td>
                      <td><Badge bg="light" text="dark">{ticket.category}</Badge></td>
                      <td>{ticket.opened?.substring(0, 10)}</td>
                      <td>
                        <Badge className="badge-subscription" bg={getStatusBadge(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          title="View Details"
                          onClick={() => handleOpenModal(ticket)}
                        >
                          <Eye className="lucide-icon" />
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="outline-success"
                          size="sm"
                          title={`Email ${ticket.client}`}
                          onClick={() => handleSendEmail(ticket)}
                        >
                          <Mail className="lucide-icon" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      No support tickets found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}

          {/* ✅ Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        </Card.Body>
      </Card>

      {/* ✅ Ticket Detail Modal */}
      {viewingTicket && (
        <TicketDetailModal show={showModal} handleClose={handleCloseModal} ticketData={viewingTicket} />
      )}
    </div>
  );
};

export default Support;
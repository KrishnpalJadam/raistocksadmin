// src/components/Support/Support.jsx

import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Form, Row, Col, Pagination, Badge } from 'react-bootstrap';
import { Search, Filter, MessageSquare, Eye } from 'lucide-react';
import TicketDetailModal from './TicketDetailModal';

// Mock Data
const mockTickets = [
    { id: 101, client: 'Ravi Sharma', email: 'ravi@example.com', subject: 'Login issue after plan change', date: '2025-10-01 09:15', status: 'Open', category: 'Technical', issue: 'Cannot log in since upgrading to the Investor plan two days ago.' },
    { id: 102, client: 'Priya Verma', email: 'priya@example.com', subject: 'Invoice needed for monthly payment', date: '2025-09-30 14:30', status: 'In-progress', category: 'Billing', issue: 'Need a GST compliant invoice for my payment on the 25th.' },
    { id: 103, client: 'Amit Singh', email: 'amit@example.com', subject: 'Question about RAI Dashboard access', date: '2025-09-29 11:00', status: 'Resolved', category: 'Content', issue: 'My RAI dashboard section is still showing limited data.' },
    { id: 104, client: 'Geeta Patil', email: 'geeta@example.com', subject: 'Account verification documents', date: '2025-09-28 17:00', status: 'Open', category: 'KYC', issue: 'I uploaded my documents but the status is still pending after 24 hours.' },
    // Add more for pagination
    ...Array(15).fill(null).map((_, i) => ({
        id: 105 + i,
        client: `Client ${i + 5}`,
        email: `client${i + 5}@test.com`,
        subject: i % 3 === 0 ? 'Plan query' : i % 3 === 1 ? 'Data inconsistency' : 'General Help',
        date: `2025-09-${(27 - i) < 10 ? '0' + (27 - i) : 27 - i} 10:00`,
        status: i % 4 === 0 ? 'Resolved' : i % 4 === 1 ? 'Open' : 'In-progress',
        category: i % 3 === 0 ? 'Billing' : 'Technical',
        issue: 'Brief description of the client issue.',
    }))
];

const ITEMS_PER_PAGE = 10;

// Helper to get status badge class
const getStatusBadge = (status) => {
    switch (status) {
        case 'Resolved': return 'bg-success';
        case 'In-progress': return 'bg-primary';
        case 'Open': return 'bg-danger';
        default: return 'bg-secondary';
    }
};

const Support = () => {
    const [showModal, setShowModal] = useState(false);
    const [viewingTicket, setViewingTicket] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const handleOpenModal = (ticket) => {
        setViewingTicket(ticket);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setViewingTicket(null);
    };

    // --- Filtering and Searching Logic ---
    const filteredTickets = useMemo(() => {
        return mockTickets
            .filter(ticket => {
                const searchMatch = ticket.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    ticket.id.toString().includes(searchTerm);

                const statusMatch = filterStatus === 'All' || ticket.status === filterStatus;

                return searchMatch && statusMatch;
            });
    }, [searchTerm, filterStatus]);

    // --- Pagination Logic ---
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
                    {/* Search and Filter Row */}
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
                            <span className="text-muted small">Showing {paginatedTickets.length} of {filteredTickets.length} tickets</span>
                        </Col>
                    </Row>

                    {/* Tickets Table */}
                    <Table responsive hover className="align-middle">
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Client</th>
                                <th>Query</th>
                                <th>Category</th>
                                <th>Opened</th>
                                <th>Status</th>
                                {/* <th>Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTickets.length > 0 ? (
                                paginatedTickets.map((ticket, index) => (
                                    <tr key={ticket.id}>
                                        <td><strong>{index+1}</strong></td>
                                        <td>{ticket.client}</td>
                                        <td>
                                            <small>{ticket.subject}</small>
                                        </td>
                                        <td><Badge bg="light" text="dark">{ticket.category}</Badge></td>
                                        <td>{ticket.date.substring(0, 10)}</td>
                                        <td>
                                            <Badge className="badge-subscription text-dark bg-light" bg={getStatusBadge(ticket.status)}>
                                                {ticket.status}
                                            </Badge>
                                        </td>
                                        {/* <td>
                                            <Button variant="outline-primary" size="sm" title="View Details" onClick={() => handleOpenModal(ticket)}>
                                                <Eye className="lucide-icon" />
                                            </Button>
                                        </td> */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted py-4">No support tickets found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    {/* Pagination */}
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

            {/* Ticket Detail Modal */}
            {viewingTicket && (
                <TicketDetailModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    ticketData={viewingTicket}
                />
            )}
        </div>
    );
};

export default Support;
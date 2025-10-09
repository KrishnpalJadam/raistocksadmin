// src/components/Emails/Emails.jsx

import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Form, Row, Col, Pagination, ListGroup } from 'react-bootstrap';
import { Plus, Search, Mail, Eye, Pencil, Send } from 'lucide-react';
import TemplateModal from './TemplateModal';

// Mock Data
const mockTemplates = [
    { id: 1, name: 'Welcome Email (New Client)', subject: 'Welcome to the CRM!', usage: 1200 },
    { id: 2, name: 'Subscription Renewal Alert (7 Days)', subject: 'Your plan expires soon!', usage: 450 },
    { id: 3, name: 'KYC Document Approval', subject: 'Your KYC is approved!', usage: 890 },
    { id: 4, name: 'Plan Upgrade Confirmation', subject: 'Plan upgraded successfully!', usage: 150 },
];

const mockSentEmails = [
    { id: 2001, recipient: 'ravi@example.com', template: 'Renewal Alert', status: 'Delivered', date: '2025-09-30 10:30', opens: 10 },
    { id: 2002, recipient: 'priya@example.com', template: 'Welcome Email', status: 'Opened', date: '2025-09-29 15:45', opens: 15 },
    { id: 2003, recipient: 'amit@example.com', template: 'KYC Approval', status: 'Failed', date: '2025-09-28 09:00', opens: 0 },
    { id: 2004, recipient: 'geeta@example.com', template: 'Plan Upgrade', status: 'Delivered', date: '2025-09-27 12:00', opens: 5 },
    ...Array(20).fill(null).map((_, i) => ({
        id: 2005 + i,
        recipient: `client${i + 5}@test.com`,
        template: i % 3 === 0 ? 'Welcome Email' : 'Renewal Alert',
        status: i % 4 === 0 ? 'Failed' : i % 4 === 1 ? 'Opened' : 'Delivered',
        date: `2025-09-${(26 - i) < 10 ? '0' + (26 - i) : 26 - i} 11:00`,
        opens: i % 5,
    }))
];

const ITEMS_PER_PAGE = 10;

// Helper to get status badge class
const getStatusBadge = (status) => {
    switch (status) {
        case 'Delivered': return 'bg-success';
        case 'Opened': return 'bg-primary';
        case 'Failed': return 'bg-danger';
        default: return 'bg-secondary';
    }
};

const Emails = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const handleOpenModal = (template = null) => {
        setEditingTemplate(template);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTemplate(null);
    };

    // --- Sent History Filtering and Searching Logic ---
    const filteredSentEmails = useMemo(() => {
        return mockSentEmails
            .filter(email => {
                const searchMatch = email.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    email.template.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    email.id.toString().includes(searchTerm);
                return searchMatch;
            });
    }, [searchTerm]);

    // --- Pagination Logic ---
    const totalPages = Math.ceil(filteredSentEmails.length / ITEMS_PER_PAGE);
    const paginatedSentEmails = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredSentEmails.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredSentEmails, currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="page-content">
            <h2 className="mb-4">📬 Emails & Notifications</h2>

            {/* Email Templates Section */}
            <Card className="mb-4">
                <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Email Templates</h5>
                    <Button variant="success" onClick={() => handleOpenModal()}>
                        <Plus className="lucide-icon me-2" /> New Template
                    </Button>
                </Card.Header>
                <ListGroup variant="flush">
                    {mockTemplates.map(template => (
                        <ListGroup.Item key={template.id} className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <Mail className="lucide-icon me-3 text-primary" />
                                <div>
                                    <strong>{template.name}</strong><br/>
                                    <small className="text-muted">{template.subject}</small>
                                </div>
                            </div>
                            <div>
                                <span className="badge bg-light text-dark me-3">Used: {template.usage} times</span>
                                <Button variant="outline-primary" size="sm" className="me-2" title="View/Edit" onClick={() => handleOpenModal(template)}>
                                    <Pencil className="lucide-icon" />
                                </Button>
                                <Button variant="outline-info" size="sm" title="Send Test">
                                    <Send className="lucide-icon" />
                                </Button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card>

            {/* Sent Email History Table */}
            <Card>
                <Card.Header className="bg-white border-bottom">
                    <h5 className="mb-0">Sent Email History</h5>
                </Card.Header>
                <Card.Body>
                    {/* Search Bar */}
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group className="d-flex">
                                <Search className="lucide-icon me-2 mt-2 text-secondary" />
                                <Form.Control
                                    type="text"
                                    placeholder="Search by recipient or template name..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} className="d-flex align-items-center justify-content-end">
                            <span className="text-muted small">Total Sent: {filteredSentEmails.length}</span>
                        </Col>
                    </Row>

                    {/* Sent Emails Table */}
                    <Table responsive hover className="align-middle">
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Recipient</th>
                                <th>Template Used</th>
                                <th>Status</th>
                                <th>Opens</th>
                                <th>Sent Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedSentEmails.length > 0 ? (
                                paginatedSentEmails.map((email) => (
                                    <tr key={email.id}>
                                        <td>{email.id}</td>
                                        <td><strong>{email.recipient}</strong></td>
                                        <td>{email.template}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(email.status)}`}>
                                                {email.status}
                                            </span>
                                        </td>
                                        <td>{email.opens}</td>
                                        <td>{email.date}</td>
                                        <td>
                                            <Button variant="outline-secondary" size="sm" title="View Email Content">
                                                <Eye className="lucide-icon" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted py-4">No sent emails match your criteria.</td>
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

            {/* Email Template Add/Edit Modal */}
            <TemplateModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                templateData={editingTemplate} 
            />
        </div>
    );
};

export default Emails;
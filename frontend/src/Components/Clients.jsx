// src/components/Clients/Clients.jsx

import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Form, Row, Col, Pagination } from 'react-bootstrap';
import { Plus, Search, Filter, Pencil, Trash, FileText, DollarSign, Key } from 'lucide-react';
import ClientFormModal from './ClientFormModal';

// Mock Data
const mockClients = [
    { id: 1, name: 'Ravi Sharma', email: 'ravi@example.com', phone: '9876543210', subscription: 'Investor', status: 'Active', days: 45, kyc: 'Approved' },
    { id: 2, name: 'Priya Verma', email: 'priya@example.com', phone: '9988776655', subscription: 'Trader', status: 'Active', days: 90, kyc: 'Pending' },
    { id: 3, name: 'Amit Singh', email: 'amit@example.com', phone: '9001122334', subscription: 'Trial', status: 'Inactive', days: 7, kyc: 'Rejected' },
    { id: 4, name: 'Geeta Patil', email: 'geeta@example.com', phone: '9123456789', subscription: 'Extended Trial', status: 'Active', days: 15, kyc: 'Approved' },
    { id: 5, name: 'Sanjay Kumar', email: 'sanjay@example.com', phone: '9555544444', subscription: 'Investor', status: 'Inactive', days: 0, kyc: 'Approved' },
    { id: 6, name: 'Sneha Reddy', email: 'sneha@example.com', phone: '9333322221', subscription: 'Trader', status: 'Active', days: 180, kyc: 'Approved' },
    // Add more clients for pagination
    ...Array(20).fill(null).map((_, i) => ({
        id: i + 7,
        name: `Client ${i + 7}`,
        email: `client${i + 7}@test.com`,
        phone: 'N/A',
        subscription: i % 3 === 0 ? 'Investor' : i % 3 === 1 ? 'Trader' : 'Trial',
        status: i % 4 === 0 ? 'Inactive' : 'Active',
        days: (i + 1) * 10,
        kyc: i % 2 === 0 ? 'Approved' : 'Pending',
    }))
];

const ITEMS_PER_PAGE = 10;

// Helper to get Bootstrap badge class for subscription type
const getSubscriptionBadge = (type) => {
    switch (type) {
        case 'Investor': return 'badge-investor';
        case 'Trader': return 'badge-trader';
        case 'Extended Trial': return 'bg-info text-white';
        default: return 'badge-trial text-dark';
    }
};

const Clients = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

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
        return mockClients
            .filter(client => {
                const searchMatch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    client.email.toLowerCase().includes(searchTerm.toLowerCase());
                
                const statusMatch = filterStatus === 'All' || client.subscription === filterStatus;

                return searchMatch && statusMatch;
            });
    }, [searchTerm, filterStatus]);

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
                    {/* <Button variant="primary" onClick={() => handleOpenModal()}>
                        <Plus className="lucide-icon me-2" /> Add New Client
                    </Button> */}
                </Card.Header>
                <Card.Body>
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
                                        setCurrentPage(1); // Reset page on search
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
                                        setCurrentPage(1); // Reset page on filter
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
                        <Col md={3} className="d-flex align-items-center justify-content-end">
                            <span className="text-muted small">Showing {paginatedClients.length} of {filteredClients.length} results</span>
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
                            {paginatedClients.map((client) => (
                                <tr key={client.id}>
                                    <td>{client.id}</td>
                                    <td>
                                        <strong>{client.name}</strong><br />
                                        <small className="text-muted">{client.email}</small>
                                    </td>
                                    <td>
                                        <span className={`badge badge-subscription ${getSubscriptionBadge(client.subscription)}`}>
                                            {client.subscription}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge bg-${client.days > 30 ? 'success' : client.days > 0 ? 'warning' : 'danger'}`}>
                                            {client.days}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge bg-${client.kyc === 'Approved' ? 'success' : client.kyc === 'Pending' ? 'warning' : 'danger'}`}>
                                            {client.kyc}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge bg-${client.status === 'Active' ? 'primary' : 'secondary'}`}>
                                            {client.status}
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
                            ))}
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
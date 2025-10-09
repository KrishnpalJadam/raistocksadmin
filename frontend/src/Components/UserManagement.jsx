// src/components/UserManagement/UserManagement.jsx

import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Form, Row, Col, Pagination, Badge } from 'react-bootstrap';
import { UserPlus, Search, Pencil, Trash, Lock } from 'lucide-react';
import UserFormModal from './UserFormModal';
import AccessControl from './AccessControl';

// Mock Data
const mockUsers = [
    { id: 1, name: 'Admin User', email: 'admin@crm.com', role: 'Admin', status: 'Active', added: '2022-01-01' },
    { id: 2, name: 'Priya Mehta', email: 'priya.m@crm.com', role: 'Manager', status: 'Active', added: '2023-05-10' },
    { id: 3, name: 'Karan Singh', email: 'karan.s@crm.com', role: 'Sales Executive', status: 'Active', added: '2024-01-15' },
    { id: 4, name: 'Sonia Desai', email: 'sonia.d@crm.com', role: 'Support Agent', status: 'Suspended', added: '2024-03-20' },
    // Add more for pagination
    ...Array(10).fill(null).map((_, i) => ({
        id: 5 + i,
        name: `CRM User ${i + 5}`,
        email: `user${i + 5}@crm.com`,
        role: i % 4 === 0 ? 'Manager' : i % 4 === 1 ? 'Sales Executive' : 'Support Agent',
        status: i % 5 === 0 ? 'Suspended' : 'Active',
        added: `2024-06-${(30 - i) < 10 ? '0' + (30 - i) : 30 - i}`,
    }))
];

const ITEMS_PER_PAGE = 8;

// Helper to get role badge class
const getRoleBadge = (role) => {
    switch (role) {
        case 'Admin': return 'danger';
        case 'Manager': return 'primary';
        case 'Sales Executive': return 'success';
        case 'Support Agent': return 'info';
        default: return 'secondary';
    }
};

const UserManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const handleOpenModal = (user = null) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const handleDeleteUser = (user) => {
        if (window.confirm(`Are you sure you want to permanently remove user ${user.name}?`)) {
            console.log('Deleting User:', user.id);
            alert(`User ${user.name} deleted.`);
        }
    };

    // --- Filtering and Searching Logic ---
    const filteredUsers = useMemo(() => {
        return mockUsers
            .filter(user => {
                const searchMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    user.role.toLowerCase().includes(searchTerm.toLowerCase());
                return searchMatch;
            });
    }, [searchTerm]);

    // --- Pagination Logic ---
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="page-content">
            <h2 className="mb-4">👨‍💼 User Management</h2>

            {/* User List Table */}
            <Card>
                <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">CRM Users ({filteredUsers.length})</h5>
                    <Button variant="success" onClick={() => handleOpenModal()}>
                        <UserPlus className="lucide-icon me-2" /> Add New User
                    </Button>
                </Card.Header>
                <Card.Body>
                    {/* Search Bar */}
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group className="d-flex">
                                <Search className="lucide-icon me-2 mt-2 text-secondary" />
                                <Form.Control
                                    type="text"
                                    placeholder="Search by name, email, or role..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} className="d-flex align-items-center justify-content-end">
                            <span className="text-muted small">Total Active Users: {mockUsers.filter(u => u.status === 'Active').length}</span>
                        </Col>
                    </Row>

                    {/* Users Table */}
                    <Table responsive hover className="align-middle">
                        <thead>
                            <tr>
                                <th>Name / Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Added On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.length > 0 ? (
                                paginatedUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <strong>{user.name}</strong><br />
                                            <small className="text-muted">{user.email}</small>
                                        </td>
                                        <td>
                                            <Badge bg={getRoleBadge(user.role)}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge bg={user.status === 'Active' ? 'success' : 'secondary'}>
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td>{user.added}</td>
                                        <td>
                                            <Button variant="outline-primary" size="sm" className="me-1" title="Edit User" onClick={() => handleOpenModal(user)}>
                                                <Pencil className="lucide-icon" />
                                            </Button>
                                            <Button variant="outline-danger" size="sm" className="me-1" title="Remove User" onClick={() => handleDeleteUser(user)}>
                                                <Trash className="lucide-icon" />
                                            </Button>
                                            <Button variant="outline-secondary" size="sm" title="Suspend/Activate">
                                                <Lock className="lucide-icon" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted py-4">No CRM users found matching your criteria.</td>
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

            {/* Access Control/Hierarchy Section */}
            <AccessControl />

            {/* User Add/Edit Modal */}
            <UserFormModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                userData={editingUser} 
            />
        </div>
    );
};

export default UserManagement;
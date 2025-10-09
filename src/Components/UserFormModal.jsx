// src/components/UserManagement/UserFormModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { UserPlus, Save, Lock } from 'lucide-react';

const UserFormModal = ({ show, handleClose, userData }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Support Agent',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                role: userData.role || 'Support Agent',
                password: '',
                confirmPassword: '',
            });
        } else {
            setFormData({
                name: '',
                email: '',
                role: 'Support Agent',
                password: '',
                confirmPassword: '',
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // UI-only validation placeholder
        if (!isEditMode && formData.password !== formData.confirmPassword) {
            alert('Error: Passwords do not match.');
            return;
        }

        console.log('Saving User Data:', formData);
        handleClose();
    };

    const isEditMode = !!userData;

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton className={`bg-${isEditMode ? 'primary' : 'success'} text-white`}>
                <Modal.Title><UserPlus className="lucide-icon me-2" /> {isEditMode ? 'Edit CRM User' : 'Add New CRM User'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email (Login ID)</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>User Role / Access Level</Form.Label>
                        <Form.Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="Admin">Admin (Full Access)</option>
                            <option value="Manager">Manager (Supervisory)</option>
                            <option value="Sales Executive">Sales Executive (Leads/Clients)</option>
                            <option value="Support Agent">Support Agent (Support/Emails)</option>
                        </Form.Select>
                    </Form.Group>
                    
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>{isEditMode ? 'New Password (Leave Blank to Keep)' : 'Password'}</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required={!isEditMode}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>{isEditMode ? 'Confirm New Password' : 'Confirm Password'}</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required={!isEditMode || formData.password !== ''}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-3">
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            <Save className="lucide-icon me-2" /> {isEditMode ? 'Update User' : 'Add User'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UserFormModal;
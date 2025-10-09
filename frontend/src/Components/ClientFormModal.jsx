// src/components/Clients/ClientFormModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Save, XCircle } from 'lucide-react';

const ClientFormModal = ({ show, handleClose, clientData }) => {
    // Initial form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subscription: 'Trial',
        joiningDate: new Date().toISOString().slice(0, 10),
    });

    // Populate form data if editing (clientData is present)
    useEffect(() => {
        if (clientData) {
            setFormData({
                name: clientData.name || '',
                email: clientData.email || '',
                phone: clientData.phone || '',
                subscription: clientData.subscription || 'Trial',
                joiningDate: clientData.joiningDate || new Date().toISOString().slice(0, 10),
            });
        } else {
            // Reset for Add New Client
            setFormData({
                name: '',
                email: '',
                phone: '',
                subscription: 'Trial',
                joiningDate: new Date().toISOString().slice(0, 10),
            });
        }
    }, [clientData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder for saving data (UI only)
        console.log('Saving Client Data:', formData);
        handleClose();
    };

    const isEditMode = !!clientData;

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title>{isEditMode ? '👥 Edit Client Profile' : '➕ Add New Client'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter client's full name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter client email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Enter phone number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Subscription Plan</Form.Label>
                                <Form.Select
                                    name="subscription"
                                    value={formData.subscription}
                                    onChange={handleChange}
                                >
                                    <option value="Trial">Trial</option>
                                    <option value="Extended Trial">Extended Trial</option>
                                    <option value="Investor">Investor</option>
                                    <option value="Trader">Trader</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Joining Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="joiningDate"
                            value={formData.joiningDate}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <hr />
                    {/* Additional fields for KYC/Details could go here */}
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            <XCircle className="lucide-icon me-2" /> Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            <Save className="lucide-icon me-2" /> {isEditMode ? 'Update Client' : 'Add Client'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ClientFormModal;
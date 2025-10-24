// src/components/Plans/PlanClientsModal.jsx

import React, { useState, useMemo } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { X } from 'lucide-react';

const PlanClientsModal = ({ show, handleClose, planName, clients }) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Filtered clients based on search
    const filteredClients = useMemo(() => {
        return clients.filter(client =>
            client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (client.panCard && client.panCard.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (client.aadhaar && client.aadhaar.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, clients]);

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="xl"
            centered
            className="plan-clients-modal"
        >
            <Modal.Header className="plan-clients-modal-header">
                <Modal.Title>
                    Clients on <span className="fw-bold">{planName}</span> Plan
                </Modal.Title>
                <Button variant="light" onClick={handleClose}>
                    <X size={20} />
                </Button>
            </Modal.Header>

            <Modal.Body className="plan-clients-modal-body">
                <Form className="mb-3 plan-clients-search">
                    <Form.Control
                        type="text"
                        placeholder="Search by Name, Email, Contact, PAN or Aadhaar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Form>

                <div className="table-responsive plan-clients-table">
                    <Table striped bordered hover>
                        <thead className="table-header bg-dark text-white">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact</th>
                                <th>PAN Card</th>
                                <th>Aadhaar Number</th>
                                <th>Date of Birth</th>
                                <th>Plan</th>
                                <th>Start Date</th>
                                <th>Expiry Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.length > 0 ? (
                                filteredClients.map((client, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{client.name}</td>
                                        <td>{client.email}</td>
                                        <td>{client.contact}</td>
                                        <td>{client.panCard || '-'}</td>
                                        <td>{client.aadhaar || '-'}</td>
                                        <td>{client.dob || '-'}</td>
                                        <td>{client.plan}</td>
                                        <td>{client.startDate}</td>
                                        <td>{client.expiryDate}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} className="text-center text-muted">
                                        No clients found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Modal.Body>

            <Modal.Footer className="plan-clients-modal-footer">
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PlanClientsModal;

// src/components/Plans/SwitchPlanModal.jsx

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { RefreshCw, User, Zap } from 'lucide-react';

const mockClientsList = [
    { id: 1, name: 'Ravi Sharma', currentPlan: 'Trial' },
    { id: 2, name: 'Priya Verma', currentPlan: 'Investor (M)' },
    { id: 3, name: 'Amit Singh', currentPlan: 'Trader (Q)' },
    { id: 4, name: 'Geeta Patil', currentPlan: 'Extended Trial' },
];

const SwitchPlanModal = ({ show, handleClose }) => {
    const [selectedClient, setSelectedClient] = useState('');
    const [newPlan, setNewPlan] = useState('Trial');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedClient) {
            alert('Please select a client.');
            return;
        }
        // Placeholder for plan switching logic (UI only)
        const clientName = mockClientsList.find(c => c.id === parseInt(selectedClient))?.name || 'Unknown Client';
        console.log(`Switching Client ${clientName} (ID: ${selectedClient}) to ${newPlan}`);
        alert(`Successfully set ${clientName} to ${newPlan}.`);
        handleClose();
        setSelectedClient('');
        setNewPlan('Trial');
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title><RefreshCw className="lucide-icon me-2" /> Switch/Upgrade Client Plan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Client Selection */}
                    <Form.Group className="mb-3">
                        <Form.Label><User className="lucide-icon me-1" /> Select Client</Form.Label>
                        <Form.Select
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            required
                        >
                            <option value="">-- Choose a Client --</option>
                            {mockClientsList.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.name} (Current: {client.currentPlan})
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* New Plan Selection */}
                    <Form.Group className="mb-4">
                        <Form.Label><Zap className="lucide-icon me-1" /> Choose New Plan</Form.Label>
                        <Form.Select
                            value={newPlan}
                            onChange={(e) => setNewPlan(e.target.value)}
                            required
                        >
                            <option value="Trial">Trial (7 Days)</option>
                            <option value="Extended Trial">Extended Trial (15 Days)</option>
                            <option disabled>--- Investor Plans ---</option>
                            <option value="Investor (M)">Investor (Monthly)</option>
                            <option value="Investor (Q)">Investor (Quarterly)</option>
                            <option value="Investor (Y)">Investor (Yearly)</option>
                            <option disabled>--- Trader Plans ---</option>
                            <option value="Trader (M)">Trader (Monthly)</option>
                            <option value="Trader (Q)">Trader (Quarterly)</option>
                            <option value="Trader (Y)">Trader (Yearly)</option>
                        </Form.Select>
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            <RefreshCw className="lucide-icon me-2" /> Confirm Switch
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SwitchPlanModal;
// src/components/Support/TicketDetailModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Badge, Row, Col, Card } from 'react-bootstrap';
import { RefreshCw, User, Mail, MessageSquare, Clock, XCircle, CheckCircle, Send } from 'lucide-react';

const mockReplies = [
    { id: 1, sender: 'Admin User', content: 'Thank you for reaching out. We are investigating the issue with your dashboard access now.', date: '2025-10-01 10:00' },
  
];

const getStatusColor = (status) => {
    switch (status) {
        case 'Resolved': return 'success';
        case 'In-progress': return 'primary';
        case 'Open': return 'danger';
        default: return 'secondary';
    }
};

const TicketDetailModal = ({ show, handleClose, ticketData }) => {
    const [currentStatus, setCurrentStatus] = useState(ticketData ? ticketData.status : 'Open');
    const [newReply, setNewReply] = useState('');

    useEffect(() => {
        if (ticketData) {
            setCurrentStatus(ticketData.status);
        }
    }, [ticketData]);

    if (!ticketData) return null; // Don't render if no ticket is passed

    const handleStatusUpdate = (e) => {
        const newStatus = e.target.value;
        setCurrentStatus(newStatus);
        console.log(`Ticket ${ticketData.id} status updated to: ${newStatus}`);
        // In a real app, this would trigger an API call
    };

    const handleSendReply = () => {
        if (newReply.trim() === '') return;
        console.log(`Sending reply to Ticket ${ticketData.id}: ${newReply}`);
        setNewReply('');
        alert(`Reply sent to ${ticketData.client}.`);
        // In a real app, mockReplies would be updated with the new reply
    };

    const StatusIcon = currentStatus === 'Resolved' ? CheckCircle : currentStatus === 'In-progress' ? RefreshCw : XCircle;

    return (
        <Modal show={show} onHide={handleClose} size="xl" centered>
            <Modal.Header closeButton className={`bg-${getStatusColor(currentStatus)} text-white`}>
                <Modal.Title><MessageSquare className="lucide-icon me-2" /> Ticket #{ticketData.id} - {ticketData.subject}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    {/* Ticket Details Column */}
                    <Col lg={4} className="mb-4">
                        <Card className="shadow-sm border-0">
                            <Card.Body>
                                <h5>Ticket Information</h5>
                                <p className="text-muted small border-bottom pb-2">Client Details</p>
                                
                                <p><User className="lucide-icon me-2 text-primary" /> **Client:** {ticketData.client}</p>
                                <p><Mail className="lucide-icon me-2 text-primary" /> **Email:** {ticketData.email}</p>
                                <p><Clock className="lucide-icon me-2 text-primary" /> **Opened:** {ticketData.date}</p>
                                <p>
                                    <MessageSquare className="lucide-icon me-2 text-primary" /> **Category:** <Badge bg="light" text="dark" className="ms-2">{ticketData.category}</Badge>
                                </p>

                                <hr/>

                                {/* Status Update Control */}
                                <Form.Group className="mb-3">
                                    <Form.Label className="d-block">
                                        <StatusIcon className={`lucide-icon me-2 text-${getStatusColor(currentStatus)}`} />
                                        **Current Status**
                                    </Form.Label>
                                    <Form.Select value={currentStatus} onChange={handleStatusUpdate}>
                                        <option value="Open">Open</option>
                                        <option value="In-progress">In-progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </Form.Select>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Thread/Reply Column */}
                    <Col lg={8}>
                        <h5>Ticket Thread</h5>
                        <div className="ticket-thread border p-3 rounded" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                            {mockReplies.slice().reverse().map((reply, index) => (
                                <div key={index} className={`mb-3 p-3 rounded ${reply.sender.includes('Admin') ? 'bg-light border' : 'bg-white border border-primary border-opacity-25'}`}>
                                    <p className="mb-1">
                                        <small className="text-muted float-end">{reply.date}</small>
                                        <strong>{reply.sender}</strong>
                                    </p>
                                    <p className="mb-0">{reply.content}</p>
                                </div>
                            ))}
                          
                        </div>

                        {/* Admin Reply Form */}
                        <Card className="mt-3">
                            <Card.Body>
                                <h6>Reply</h6>
                                <Form.Group className="mb-3">
                                    <Form.Control 
                                        as="textarea" 
                                        rows={3} 
                                        placeholder="Type your response to the client..."
                                        value={newReply}
                                        onChange={(e) => setNewReply(e.target.value)}
                                    />
                                </Form.Group>
                                <div className="d-flex justify-content-end">
                                    <Button variant="primary" onClick={handleSendReply} disabled={newReply.trim() === ''}>
                                        <Send className="lucide-icon me-2" /> Send Update
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TicketDetailModal;
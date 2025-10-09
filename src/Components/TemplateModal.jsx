// src/components/Emails/TemplateModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { Mail, Save, XCircle, Code } from 'lucide-react';

const TemplateModal = ({ show, handleClose, templateData }) => {
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        content: '',
    });
    const [showVariables, setShowVariables] = useState(false);

    useEffect(() => {
        if (templateData) {
            setFormData({
                name: templateData.name || '',
                subject: templateData.subject || '',
                content: templateData.content || 'Start editing your email template content here...',
            });
        } else {
            // Reset for Add New Template
            setFormData({
                name: '',
                subject: '',
                content: 'Start editing your email template content here...',
            });
        }
    }, [templateData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder for saving data (UI only)
        console.log('Saving Email Template:', formData);
        alert(`${templateData ? 'Updated' : 'Created'} Template: ${formData.name}`);
        handleClose();
    };

    const isEditMode = !!templateData;

    return (
        <Modal show={show} onHide={handleClose} size="xl" centered>
            <Modal.Header closeButton className={`bg-${isEditMode ? 'primary' : 'success'} text-white`}>
                <Modal.Title><Mail className="lucide-icon me-2" /> {isEditMode ? 'Edit Email Template' : 'Create New Template'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Template Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="e.g., Welcome Email, Subscription Renewal"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email Subject</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Subject line (use {client_name} for personalization)"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    
                    {/* Rich Text Editor Placeholder */}
                    <Form.Group className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <Form.Label>Email Content (Rich Text Input Placeholder)</Form.Label>
                            <Button variant="outline-secondary" size="sm" onClick={() => setShowVariables(!showVariables)}>
                                <Code className="lucide-icon me-1" /> Template Variables
                            </Button>
                        </div>
                        
                        {showVariables && (
                             <Alert variant="light" className="p-2 small border">
                                Available Variables: <span className="text-primary me-2">`{client_name}`</span> <span className="text-primary me-2">`{days_remaining}`</span> <span className="text-primary me-2">`{login_url}`</span> <span className="text-primary">`{admin_contact}`</span>
                            </Alert>
                        )}

                        {/* This TextArea acts as a placeholder for a real Rich Text Editor (e.g., TinyMCE, Draft.js, Quill) */}
                        <Form.Control
                            as="textarea"
                            rows={10}
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            style={{ fontFamily: 'monospace, sans-serif', fontSize: '0.9rem' }}
                            placeholder="Template content (HTML or plain text)..."
                            required
                        />
                        <Form.Text className="text-muted">
                            In a full application, this would be a WYSIWYG editor for easy formatting.
                        </Form.Text>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    <XCircle className="lucide-icon me-2" /> Cancel
                </Button>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    <Save className="lucide-icon me-2" /> {isEditMode ? 'Save Changes' : 'Create Template'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TemplateModal;
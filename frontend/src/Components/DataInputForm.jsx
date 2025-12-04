// src/components/RAI/DataInputForm.jsx

import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Database, Upload, TrendingUp } from 'lucide-react';

const DataInputForm = () => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().slice(0, 10),
        marketSentiment: 'Neutral',
        raifactor: 1.05,
        dailyTarget: 0.0,
        notes: '',
    });
    const [status, setStatus] = useState(null); // 'success' or 'error'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus(null);
        
        // Placeholder for data validation and API call (UI only)

        // Simulate success/error response
        setTimeout(() => {
            setStatus('success');
            // Reset fields except date for quick entry
            setFormData(prev => ({ ...prev, marketSentiment: 'Neutral', raifactor: 1.05, dailyTarget: 0.0, notes: '' }));
        }, 1000);
    };

    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0"><Database className="lucide-icon me-2 text-info" /> Daily RAI Data Input</h5>
            </Card.Header>
            <Card.Body>
                {status === 'success' && (
                    <Alert variant="success" onClose={() => setStatus(null)} dismissible>
                        RAI data for **{formData.date}** submitted successfully!
                    </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Date of Data</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Market Sentiment</Form.Label>
                                <Form.Select
                                    name="marketSentiment"
                                    value={formData.marketSentiment}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Bullish">Bullish</option>
                                    <option value="Neutral">Neutral</option>
                                    <option value="Bearish">Bearish</option>
                                    <option value="Volatile">Highly Volatile</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>RAI Factor (Multiplier)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="raifactor"
                                    value={formData.raifactor}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Text className="text-muted">
                                    Used to adjust risk metrics (e.g., 1.0 = baseline).
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Daily Target / Key Metric</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            name="dailyTarget"
                            value={formData.dailyTarget}
                            onChange={handleChange}
                            placeholder="Enter percentage or value"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Admin Notes / Rationale</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Brief analysis or justification for the RAI factor..."
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                        <Button variant="info" type="submit">
                            <Upload className="lucide-icon me-2" /> Submit RAI Data
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default DataInputForm;
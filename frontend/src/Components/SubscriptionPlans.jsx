// src/components/Plans/SubscriptionPlans.jsx

import React, { useState } from 'react';
import { Card, Button, Row, Col, ListGroup, Modal, Form } from 'react-bootstrap';
import { Check, Clock, TrendingUp, DollarSign, Users, RefreshCw, Edit3 } from 'lucide-react';
import SwitchPlanModal from './SwitchPlanModal';
import PlanClientsModal from './PlanClientsModal';

const planTiers = [
    {
        name: 'Trial',
        badge: 'bg-secondary',
        description: 'Standard limited access.',
        options: [
            { period: '15 Days', price: '₹999' },

        ],
        features: [
            // --- Features ---
            "1 – 4 actionable ideas every market day*",
            "Scalp Trades – Quickfire momentum opportunities",
            "Intraday Trades – Precision-based daily setups",
            "Swing Trades – Hold for days/weeks with defined risk levels",
            "Investment Ideas – Long-term fundamental picks",
            "Strategic Positions – Based on macro & sentiment analysis",
            "Income-Generating Ideas – Designed for passive returns",
        ],
        services: [
            // --- Services ---
            "Delivered via WhatsApp for faster execution",
            "Personal Dashboard access",
            "Real-time tracking of all active and closed trades",
            "Performance reports and allocation summaries",
            "Personalized Trade Diary to record and review each idea",
            "All trades are trackable ensuring full transparency and control",
            "End-of-trial performance report",
        ],
    },
    {
        name: 'Extended Trial',
        badge: 'bg-info',
        description: 'Extended limited access for evaluation.',
        features: ['15 Days Duration', 'Basic RAI Access (Limited)', 'Email Support Only', 'Free (Admin Approved)']
    },
    {
        name: 'Investor',
        badge: 'bg-primary',
        description: 'Designed for long-term investors.',
        options: [
            { period: 'Monthly', price: '₹2,299' },
            { period: 'Quarterly', price: '₹4,999' },
            { period: 'Yearly', price: '₹12,999' }
        ],
        features: [
            "1-4* actionable ideas every market week",
            "Swing Trades – Hold for weeks to months with precise entry/exit logic",
            "Investment Ideas – Long-term picks with strong fundamentals",
            "F&O for portfolio hedging (Minimum 8 calls per month)",
        ],
        services: [
            "Delivered via WhatsApp for faster execution",
            "Personal Dashboard",
            "Real-time tracking of all active and closed trades",
            "Access to performance reports and allocation summaries",
            "A personalized Trade Diary to record and review each idea",
            "All your trades are trackable, ensuring full transparency and control",
            "Monthly performance report",
        ],
    },
    {
        name: 'Trader',
        badge: 'bg-success',
        description: 'Optimized for active daily traders.',
        options: [
            { period: 'Monthly', price: '₹4,999' },
            { period: 'Quarterly', price: '₹11,999' },
            { period: 'Yearly', price: '₹35,999' }
        ],
        features: [
            "1 – 4 actionable ideas every market day*",
            "Scalp Trades – Quickfire momentum opportunities",
            "Intraday Trades – Precision-based daily setups",
            "Swing Trades – Hold for days/weeks with defined risk levels",
            "Investment Ideas – Long-term fundamental picks",
            "Strategic Positions – Based on macro & sentiment analysis",
            "Income-Generating Ideas – Designed for passive returns (Minimum 24 calls per month)",
        ],
        services: [
            "Delivered via WhatsApp for faster execution",
            "Personal Dashboard",
            "Real-time tracking of all active and closed trades",
            "Access to performance reports and allocation summaries",
            "A personalized Trade Diary to record and review each idea",
            "All your trades are trackable, ensuring full transparency and control",
            "Monthly performance report",
        ],
    },
];

const SubscriptionPlans = () => {
    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const [plans, setPlans] = useState(planTiers);

    const handleCloseModal = () => setShowModal(false);


    const [modalShow, setModalShow] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [clientsData, setClientsData] = useState([
        // Example client data
        { name: 'John Doe', email: 'john@example.com', contact: '9876543210', plan: 'Trader', startDate: '2025-10-01', expiryDate: '2025-11-01' },
        { name: 'Jane Smith', email: 'jane@example.com', contact: '9123456780', plan: 'Investor', startDate: '2025-09-15', expiryDate: '2026-09-15' },
    ]);


    const [editModalShow, setEditModalShow] = useState(false);
    const [editData, setEditData] = useState({});

    const handleEditClick = (plan) => {
        setEditData(plan);
        setEditModalShow(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSave = () => {
        const updatedPlans = plans.map((p) =>
            p.name === editData.name ? editData : p
        );
        setPlans(updatedPlans);
        setEditModalShow(false);
    };

    // Determine card variant based on plan type
    const getCardVariant = (planName) => {
        if (planName === 'Investor') return 'border-primary';
        if (planName === 'Trader') return 'border-success';
        return 'border-light';
    };

    return (
        <div className="page-content">
            <h2 className="mb-4">📑 Subscription Plans Management</h2>
            <div className="d-flex justify-content-between align-items-center mb-4">
                {/* <p className="lead text-muted">View all available plans and manage client subscriptions.</p> */}
                {/* <Button variant="primary" onClick={handleOpenModal}>
                    <RefreshCw className="lucide-icon me-2" /> Switch Client Plan
                </Button> */}
            </div>

            <Row>
                {plans.map((plan, index) => (
                    <Col lg={3} md={6} sm={12} className="mb-4" key={index}>
                        <Card className={`h-100 shadow-sm ${getCardVariant(plan.name)}`}>
                            <Card.Header className={`text-white p-3 ${plan.badge}`}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">{plan.name}</h5>
                                    {plan.name.includes('Trial') ? <Clock size={20} /> : <TrendingUp size={20} />}
                                </div>
                            </Card.Header>

                            <Card.Body className="d-flex flex-column">
                                <p className="text-muted small mb-3">{plan.description}</p>

                                {plan.options ? (
                                    <>
                                        <h6 className="text-primary mb-2">Pricing Options:</h6>
                                        <ListGroup variant="flush" className="mb-3">
                                            {plan.options.map((option, idx) => (
                                                <ListGroup.Item key={idx} className="d-flex justify-content-between p-2">
                                                    <span>{option.period}</span>
                                                    <strong className="text-success">{option.price}</strong>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </>
                                ) : (
                                    <h3 className="mb-4">
                                        <DollarSign className="lucide-icon me-1 text-success" /> Free
                                    </h3>
                                )}

                                <h6 className="text-secondary mb-2">Key Features:</h6>
                                <ListGroup variant="flush" className="flex-grow-1">
                                    {plan.features.map((feature, fIndex) => (
                                        <ListGroup.Item key={fIndex} className="d-flex align-items-start p-2 border-0">
                                            <Check size={18} className="text-success me-2 flex-shrink-0" />
                                            <span className="small">{feature}</span>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>

                            <Card.Footer className="bg-white border-top text-center">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => {
                                        setSelectedPlan(plan.name);
                                        setModalShow(true);
                                    }}
                                >
                                    <Users className="lucide-icon me-2" /> View Clients
                                </Button>

                                <Button
                                    variant="outline-dark"
                                    size="sm"
                                    onClick={() => handleEditClick(plan)}
                                >
                                    <Edit3 className="lucide-icon me-2" /> Edit
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>




            {/* Edit Plan Modal */}
            <Modal show={editModalShow} onHide={() => setEditModalShow(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Plan Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Plan Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={editData.name || ''}
                                onChange={handleEditChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="description"
                                value={editData.description || ''}
                                onChange={handleEditChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Features (comma separated)</Form.Label>
                            <Form.Control
                                type="text"
                                name="features"
                                value={editData.features?.join(', ') || ''}
                                onChange={(e) =>
                                    setEditData((prev) => ({
                                        ...prev,
                                        features: e.target.value.split(',').map((f) => f.trim()),
                                    }))
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Pricing Options</Form.Label>
                            {editData.options?.map((opt, idx) => (
                                <Row key={idx} className="mb-2">
                                    <Col>
                                        <Form.Control
                                            type="text"
                                            placeholder="Period"
                                            value={opt.period}
                                            onChange={(e) => {
                                                const newOptions = [...editData.options];
                                                newOptions[idx].period = e.target.value;
                                                setEditData({ ...editData, options: newOptions });
                                            }}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type="text"
                                            placeholder="Price"
                                            value={opt.price}
                                            onChange={(e) => {
                                                const newOptions = [...editData.options];
                                                newOptions[idx].price = e.target.value;
                                                setEditData({ ...editData, options: newOptions });
                                            }}
                                        />
                                    </Col>
                                </Row>
                            ))}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setEditModalShow(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEditSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <PlanClientsModal
                show={modalShow}
                handleClose={() => setModalShow(false)}
                planName={selectedPlan}
                clients={clientsData.filter(c => c.plan === selectedPlan)}
            />
            {/* Admin Switch Plan Modal */}
            <SwitchPlanModal
                show={showModal}
                handleClose={handleCloseModal}
            />
        </div>
    );
};

export default SubscriptionPlans;







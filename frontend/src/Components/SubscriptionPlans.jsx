// src/components/Plans/SubscriptionPlans.jsx

import React, { useState } from 'react';
import { Card, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { Check, Clock, TrendingUp, DollarSign, Users, RefreshCw } from 'lucide-react';
import SwitchPlanModal from './SwitchPlanModal';

const planTiers = [
    { 
        name: 'Trial', 
        badge: 'bg-secondary', 
        description: 'Standard limited access.', 
        features: ['7 Days Duration', 'Basic RAI Access (Limited)', 'Email Support Only', 'Free'] 
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
            { period: 'Monthly', price: '₹10,000' },
            { period: 'Quarterly', price: '₹25,000' },
            { period: 'Yearly', price: '₹90,000' }
        ],
        features: ['Full RAI Dashboard Access', 'Dedicated Account Manager', 'Priority Support', 'Access to Quarterly Reports'] 
    },
    { 
        name: 'Trader', 
        badge: 'bg-success', 
        description: 'Optimized for active daily traders.', 
        options: [
            { period: 'Monthly', price: '₹12,000' },
            { period: 'Quarterly', price: '₹30,000' },
            { period: 'Yearly', price: '₹110,000' }
        ],
        features: ['Real-time Data Feeds', 'Trade Diary Integration', 'Priority Support', 'Advanced Analytics Tools'] 
    },
];

const SubscriptionPlans = () => {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

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
                {planTiers.map((plan, index) => (
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
                                    <h3 className="mb-4"><DollarSign className="lucide-icon me-1 text-success" /> Free</h3>
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
                                <Button variant="outline-primary" size="sm"  disabled={plan.name.includes('Trial')}>
                                    <Users className="lucide-icon me-2" /> View Clients on this Plan
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Admin Switch Plan Modal */}
            <SwitchPlanModal 
                show={showModal} 
                handleClose={handleCloseModal} 
            />
        </div>
    );
};

export default SubscriptionPlans;
// src/components/UserManagement/AccessControl.jsx

import React from 'react';
import {Button, Card, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { Zap, Shield, Briefcase, Headset, Check, X } from 'lucide-react';

const roleAccessData = [
    {
        role: 'Admin',
        color: 'danger',
        icon: Zap,
        access: { dashboard: true, clients: true, payments: true, plans: true, emails: true, rai: true, support: true, users: true, leads: true, settings: true },
    },
    {
        role: 'Manager',
        color: 'primary',
        icon: Shield,
        access: { dashboard: true, clients: true, payments: true, plans: true, emails: true, rai: true, support: true, users: false, leads: true, settings: false },
    },
    {
        role: 'Sales Executive',
        color: 'success',
        icon: Briefcase,
        access: { dashboard: true, clients: true, payments: true, plans: false, emails: false, rai: false, support: false, users: false, leads: true, settings: false },
    },
    {
        role: 'Support Agent',
        color: 'info',
        icon: Headset,
        access: { dashboard: true, clients: true, payments: false, plans: false, emails: true, rai: false, support: true, users: false, leads: false, settings: false },
    },
];

const moduleNames = [
    { key: 'dashboard', name: 'Dashboard' },
    { key: 'clients', name: 'Clients' },
    { key: 'payments', name: 'Payments & Invoices' },
    { key: 'plans', name: 'Subscription Plans' },
    { key: 'emails', name: 'Emails & Notifications' },
    { key: 'rai', name: 'RAI Data' },
    { key: 'support', name: 'Support' },
    { key: 'users', name: 'User Management' },
    { key: 'leads', name: 'Leads' },
    { key: 'settings', name: 'Settings' },
];

const AccessControl = () => {
    return (
        <Card className="shadow-sm mt-4">
            <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">Define User Hierarchy & Access Control</h5>
                <p className="text-muted small mb-0">Quick overview of module access by role.</p>
            </Card.Header>
            <Card.Body>
                <Row>
                    {roleAccessData.map((roleData) => {
                        const Icon = roleData.icon;
                        return (
                            <Col lg={3} md={6} className="mb-4" key={roleData.role}>
                                <Card className={`h-100 border border-${roleData.color}`}>
                                    <Card.Header className={`bg-${roleData.color} text-white p-2`}>
                                        <Icon className="lucide-icon me-2" />
                                        <strong className="h6 mb-0">{roleData.role}</strong>
                                    </Card.Header>
                                    <ListGroup variant="flush">
                                        {moduleNames.map(mod => (
                                            <ListGroup.Item key={mod.key} className="d-flex justify-content-between align-items-center p-2 small">
                                                {mod.name}
                                                {roleData.access[mod.key] ? (
                                                    <Badge bg="success" className="d-flex align-items-center"><Check size={14} /></Badge>
                                                ) : (
                                                    <Badge bg="secondary" className="d-flex align-items-center"><X size={14} /></Badge>
                                                )}
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
                <div className="text-center mt-3">
                    <Button variant="outline-primary" size="sm">
                        Edit Detailed Role Permissions
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default AccessControl;
<<<<<<< HEAD
 import React, { useEffect, useState } from "react";
import { Card, Row, Col, ListGroup } from "react-bootstrap";
import { Zap, Shield, Briefcase, Headset } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRolePermissions, updateRolePermission } from "../slices/rolesPermissionSlice";

const iconMap = {
    Admin: Zap,
    Manager: Shield,
    "Sales Executive": Briefcase,
    "Support Agent": Headset,
};
=======
import React, { useState } from 'react';
import { Card, Row, Col, ListGroup } from 'react-bootstrap';
import { Zap, Shield, Briefcase, Headset } from 'lucide-react';

const initialRoleAccessData = [
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
>>>>>>> krishna16

const moduleNames = [
    { key: "dashboard", name: "Dashboard" },
    { key: "clients", name: "Clients" },
    { key: "payments", name: "Payments & Invoices" },
    { key: "plans", name: "Subscription Plans" },
    { key: "emails", name: "Emails & Notifications" },
    { key: "rai", name: "Trade Recommendation" },
    { key: "tradeSetup", name: "Trade setup" },
    { key: "support", name: "Support" },
    { key: "users", name: "User Management" },
    { key: "leads", name: "Leads" },
    {key: "coupon", name: "Coupon" },
    { key: "reSearch", name: "Research report" },
    { key: "settings", name: "Settings" },
];

const AccessControl = () => {
<<<<<<< HEAD
    const dispatch = useDispatch();
    // const { roles } = useSelector((state) => state.rolePermission || { roles: [] });
     const roles = useSelector((state) => state?.rolesPermission?.roles || []);
    //  console.log("Roles Permission State:", rolesPermissionState);
    useEffect(() => {
        dispatch(fetchRolePermissions());
    }, [dispatch]);

    // 🔄 Handle toggle + auto-save to backend
    const handleToggle = (roleObj, key) => {
        const updatedAccess = { ...roleObj.access, [key]: !roleObj.access[key] };

        dispatch(
            updateRolePermission({
                role: roleObj.role,
                access: updatedAccess,
            })
        );
=======
    const [roles, setRoles] = useState(initialRoleAccessData);

    // 🔄 Handle checkbox toggle
    const handleToggle = (roleIndex, key) => {
        const updatedRoles = [...roles];
        updatedRoles[roleIndex].access[key] = !updatedRoles[roleIndex].access[key];
        setRoles(updatedRoles);
>>>>>>> krishna16
    };

    return (
        <Card className="shadow-sm mt-4">
            <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0">Define User Hierarchy & Access Control</h5>
                <p className="text-muted small mb-0">Manage which roles can access what.</p>
            </Card.Header>

            <Card.Body>
                <Row>
<<<<<<< HEAD
                    {roles.map((roleData) => {
                        const Icon = iconMap[roleData.role] || Zap;
=======
                    {roles.map((roleData, index) => {
                        const Icon = roleData.icon;
>>>>>>> krishna16

                        return (
                            <Col lg={3} md={6} className="mb-4" key={roleData.role}>
                                <Card className={`h-100 border`}>
                                    <Card.Header className={`text-white p-2 bg-dark`}>
                                        <Icon className="me-2" />
                                        <strong className="h6 mb-0">{roleData.role}</strong>
                                    </Card.Header>

                                    <ListGroup variant="flush">
                                        {moduleNames.map((mod) => (
                                            <ListGroup.Item
                                                key={mod.key}
                                                className="d-flex justify-content-between align-items-center p-2 small"
                                            >
                                                <span>{mod.name}</span>

                                                <input
                                                    type="checkbox"
                                                    checked={roleData.access[mod.key]}
<<<<<<< HEAD
                                                    onChange={() => handleToggle(roleData, mod.key)}
=======
                                                    onChange={() => handleToggle(index, mod.key)}
>>>>>>> krishna16
                                                    style={{ width: "16px", height: "16px" }}
                                                />
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Card.Body>
        </Card>
    );
};

export default AccessControl;
<<<<<<< HEAD
=======
 
>>>>>>> krishna16

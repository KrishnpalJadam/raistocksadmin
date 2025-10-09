// src/components/Settings/Settings.jsx

import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, ListGroup, Tab, Nav } from 'react-bootstrap';
import { Settings as SettingsIcon, Globe, Plug, Lock, Cookie, Save } from 'lucide-react';

// Mock data for client access toggles
const initialRAIAccess = {
    trial: false,
    extendedTrial: false,
    investor: true,
    trader: true,
};

// Mock data for cookies
const initialCookies = {
    essential: true,
    analytics: true,
    marketing: false,
};

const Settings = () => {
    // State for General Settings
    const [generalSettings, setGeneralSettings] = useState({
        companyName: 'CRM Financials Inc.',
        timezone: 'Asia/Kolkata (IST)',
        currency: 'INR (₹)',
    });

    // State for Integration Settings
    const [integrationSettings, setIntegrationSettings] = useState({
        paymentGatewayStatus: 'Active',
        paymentGatewayAPIKey: '********ABC-123-XYZ',
        emailProviderAPIKey: '********DEF-456-GHI',
    });

    // State for RAI Access Control
    const [raiAccess, setRaiAccess] = useState(initialRAIAccess);

    // State for Cookie Management
    const [cookies, setCookies] = useState(initialCookies);

    const handleGeneralChange = (e) => {
        const { name, value } = e.target;
        setGeneralSettings(prev => ({ ...prev, [name]: value }));
    };
    
    const handleIntegrationChange = (e) => {
        const { name, value } = e.target;
        setIntegrationSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleRaiAccessToggle = (plan) => {
        setRaiAccess(prev => ({ ...prev, [plan]: !prev[plan] }));
    };
    
    const handleCookieToggle = (type) => {
        setCookies(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const handleSave = (section) => {
        console.log(`Saving ${section} settings...`);
        alert(`Settings for ${section} saved successfully!`);
        // API call would go here
    };

    return (
        <div className="page-content">
            <h2 className="mb-4">⚙️ System Settings</h2>

            <Tab.Container defaultActiveKey="rai-access">
                <Row>
                    <Col sm={3}>
                        {/* Sidebar Navigation */}
                        <Nav variant="pills" className="flex-column shadow-sm p-3 bg-white rounded">
                            {/* <Nav.Item>
                                <Nav.Link eventKey="general"><Globe className="lucide-icon me-2" /> General</Nav.Link>
                            </Nav.Item> */}
                            <Nav.Item>
                                <Nav.Link className='text-dark' eventKey="rai-access"><Lock className="lucide-icon me-2 " /> RAI Client Access</Nav.Link>
                            </Nav.Item>
                            {/* <Nav.Item>
                                <Nav.Link eventKey="integrations"><Plug className="lucide-icon me-2" /> Integrations</Nav.Link>
                            </Nav.Item> */}
                            {/* <Nav.Item>
                                <Nav.Link className='text-dark' eventKey="cookies"><Cookie className="lucide-icon me-2" /> Cookies</Nav.Link>
                            </Nav.Item> */}
                        </Nav>
                    </Col>
                    
                    <Col sm={9}>
                        <Tab.Content>
                            
                            {/* 1. General Settings */}
                            <Tab.Pane eventKey="general">
                                <Card className="shadow-sm">
                                    <Card.Header className="bg-white border-bottom">
                                        <h5 className="mb-0"><Globe className="lucide-icon me-2" /> General Settings</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Company Name</Form.Label>
                                                <Form.Control type="text" name="companyName" value={generalSettings.companyName} onChange={handleGeneralChange} />
                                            </Form.Group>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Timezone</Form.Label>
                                                        <Form.Select name="timezone" value={generalSettings.timezone} onChange={handleGeneralChange}>
                                                            <option>Asia/Kolkata (IST)</option>
                                                            <option>Europe/London (GMT)</option>
                                                            <option>America/New_York (EST)</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Base Currency</Form.Label>
                                                        <Form.Select name="currency" value={generalSettings.currency} onChange={handleGeneralChange}>
                                                            <option>INR (₹)</option>
                                                            <option>USD ($)</option>
                                                            <option>EUR (€)</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <div className="d-flex justify-content-end">
                                                <Button variant="primary" onClick={() => handleSave('General')}>
                                                    <Save className="lucide-icon me-2" /> Save General Settings
                                                </Button>
                                            </div>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            {/* 2. RAI Client Access Control */}
                            <Tab.Pane eventKey="rai-access">
                                <Card className="shadow-sm">
                                    <Card.Header className="bg-white border-bottom">
                                        <h5 className="mb-0"><Lock className="lucide-icon me-2" /> RAI Dashboard Client Access</h5>
                                        <p className="text-muted small mb-0">Toggle which client subscription plans have access to the main Risk-Adjusted Index (RAI) dashboard view.</p>
                                    </Card.Header>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Trial Plan Clients</strong>
                                                <p className="mb-0 small text-muted">7-day limited access clients.</p>
                                            </div>
                                            <Form.Check 
                                                type="switch"
                                                id="rai-trial-switch"
                                                checked={raiAccess.trial}
                                                onChange={() => handleRaiAccessToggle('trial')}
                                                label={raiAccess.trial ? "Allowed" : "Blocked"}
                                            />
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Extended Trial Clients</strong>
                                                <p className="mb-0 small text-muted">15-day administrative access clients.</p>
                                            </div>
                                            <Form.Check 
                                                type="switch"
                                                id="rai-extended-trial-switch"
                                                checked={raiAccess.extendedTrial}
                                                onChange={() => handleRaiAccessToggle('extendedTrial')}
                                                label={raiAccess.extendedTrial ? "Allowed" : "Blocked"}
                                            />
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Investor Plan Clients</strong>
                                                <p className="mb-0 small text-muted">Full-paid Investor clients (Monthly/Quarterly/Yearly).</p>
                                            </div>
                                            <Form.Check 
                                                type="switch"
                                                id="rai-investor-switch"
                                                checked={raiAccess.investor}
                                                onChange={() => handleRaiAccessToggle('investor')}
                                                label={raiAccess.investor ? "Allowed" : "Blocked"}
                                            />
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Trader Plan Clients</strong>
                                                <p className="mb-0 small text-muted">Full-paid Trader clients (Monthly/Quarterly/Yearly).</p>
                                            </div>
                                            <Form.Check 
                                                type="switch"
                                                id="rai-trader-switch"
                                                checked={raiAccess.trader}
                                                onChange={() => handleRaiAccessToggle('trader')}
                                                label={raiAccess.trader ? "Allowed" : "Blocked"}
                                            />
                                        </ListGroup.Item>
                                    </ListGroup>
                                    <Card.Footer className="bg-light text-end">
                                        <Button variant="primary" onClick={() => handleSave('RAI Access')}>
                                            <Save className="lucide-icon me-2" /> Save RAI Access Settings
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            </Tab.Pane>

                            {/* 3. Integration Settings */}
                            <Tab.Pane eventKey="integrations">
                                <Card className="shadow-sm">
                                    <Card.Header className="bg-white border-bottom">
                                        <h5 className="mb-0"><Plug className="lucide-icon me-2" /> Integration Settings</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Form>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Payment Gateway Status</Form.Label>
                                                <Form.Select name="paymentGatewayStatus" value={integrationSettings.paymentGatewayStatus} onChange={handleIntegrationChange}>
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                    <option value="Error">Error/Needs Re-auth</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Payment Gateway API Key</Form.Label>
                                                <Form.Control type="password" name="paymentGatewayAPIKey" value={integrationSettings.paymentGatewayAPIKey} onChange={handleIntegrationChange} />
                                                <Form.Text className="text-muted">Used for real-time payment confirmation and invoice generation.</Form.Text>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email Provider API Key</Form.Label>
                                                <Form.Control type="password" name="emailProviderAPIKey" value={integrationSettings.emailProviderAPIKey} onChange={handleIntegrationChange} />
                                                <Form.Text className="text-muted">Used for sending transactional and marketing emails.</Form.Text>
                                            </Form.Group>
                                            <div className="d-flex justify-content-end">
                                                <Button variant="primary" onClick={() => handleSave('Integration')}>
                                                    <Save className="lucide-icon me-2" /> Save Integration Settings
                                                </Button>
                                            </div>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                            
                            {/* 4. Cookies Management */}
                            <Tab.Pane eventKey="cookies">
                                <Card className="shadow-sm">
                                    <Card.Header className="bg-white border-bottom">
                                        <h5 className="mb-0"><Cookie className="lucide-icon me-2" /> Cookies Management</h5>
                                        <p className="text-muted small mb-0">Control the default settings for the client-facing cookie consent banner.</p>
                                    </Card.Header>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Essential Cookies</strong>
                                                <p className="mb-0 small text-muted">Required for security and core site functionality (cannot be disabled).</p>
                                            </div>
                                            <Form.Check 
                                                type="switch"
                                                id="cookie-essential"
                                                checked={cookies.essential}
                                                disabled
                                                label="Required"
                                            />
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Analytics Cookies</strong>
                                                <p className="mb-0 small text-muted">Used to track client behavior and improve service performance.</p>
                                            </div>
                                            <Form.Check 
                                                type="switch"
                                                id="cookie-analytics"
                                                checked={cookies.analytics}
                                                onChange={() => handleCookieToggle('analytics')}
                                                label={cookies.analytics ? "Enabled" : "Disabled"}
                                            />
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Marketing Cookies</strong>
                                                <p className="mb-0 small text-muted">Used for personalized advertising and retargeting efforts.</p>
                                            </div>
                                            <Form.Check 
                                                type="switch"
                                                id="cookie-marketing"
                                                checked={cookies.marketing}
                                                onChange={() => handleCookieToggle('marketing')}
                                                label={cookies.marketing ? "Enabled" : "Disabled"}
                                            />
                                        </ListGroup.Item>
                                    </ListGroup>
                                    <Card.Footer className="bg-light text-end">
                                        <Button variant="primary" onClick={() => handleSave('Cookie')}>
                                            <Save className="lucide-icon me-2" /> Save Cookie Defaults
                                        </Button>
                                    </Card.Footer>
                                </Card>
                            </Tab.Pane>

                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
};

export default Settings;
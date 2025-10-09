

import React from 'react';
import { Modal, Button, Table, Row, Col } from 'react-bootstrap';
import { Download, Printer } from 'lucide-react';

const InvoiceModal = ({ show, handleClose, invoiceData }) => {
    if (!invoiceData) {
        invoiceData = {
            id: 'GST-INV-2024-00123',
            clientName: 'Sample Client Name',
            date: '2025-10-01',
            gstin: '27AAAAA1234A1Z5',
            items: [
                { description: 'Investor Plan (Quarterly)', amount: 25000.00 },
            ],
            taxRate: 0.18, // 18% GST
            totalAmount: 29500.00,
        };
    }

    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
    const gstAmount = subtotal * invoiceData.taxRate;
    const totalPayable = subtotal + gstAmount;

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title>📑 GST Invoice: {invoiceData.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="p-3 border rounded">
                    <Row className="mb-4">
                        <Col>
                            <h4 className="text-primary">CRM Financials</h4>
                            <p className="mb-0">123 Main Street, Mumbai, 400001</p>
                            <p className="mb-0">GSTIN: 27AAAAA0000A1Z5</p>
                        </Col>
                        <Col className="text-end">
                            <h5 className="mb-0">Invoice No: {invoiceData.id}</h5>
                            <p className="mb-0">Date: {invoiceData.date}</p>
                        </Col>
                    </Row>
                    
                    <Row className="mb-4">
                        <Col>
                            <h6>Bill To:</h6>
                            <p className="mb-0"><strong>{invoiceData.clientName}</strong></p>
                            <p className="mb-0">Client GSTIN: {invoiceData.gstin}</p>
                        </Col>
                    </Row>

                    <h6>Invoice Details:</h6>
                    <Table bordered striped size="sm" className="mb-4">
                        <thead>
                            <tr className="bg-light">
                                <th>Description</th>
                                <th className="text-end">Taxable Value (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoiceData.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.description}</td>
                                    <td className="text-end">₹{item.amount.toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Row className="justify-content-end">
                        <Col md={5}>
                            <Table borderless size="sm">
                                <tbody>
                                    <tr>
                                        <td>Sub Total:</td>
                                        <td className="text-end">₹{subtotal.toLocaleString('en-IN')}</td>
                                    </tr>
                                    <tr>
                                        <td>GST ({invoiceData.taxRate * 100}%):</td>
                                        <td className="text-end text-success">₹{gstAmount.toLocaleString('en-IN')}</td>
                                    </tr>
                                    <tr className="border-top border-2">
                                        <td><strong>Total Amount Due:</strong></td>
                                        <td className="text-end"><strong>₹{totalPayable.toLocaleString('en-IN')}</strong></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="outline-primary">
                    <Download className="lucide-icon me-2" /> Download PDF
                </Button>
                <Button variant="primary">
                    <Printer className="lucide-icon me-2" /> Print Invoice
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default InvoiceModal;
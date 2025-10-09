

import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Form, Row, Col, Pagination } from 'react-bootstrap';
import { Search, Filter, RefreshCw, CheckCircle, Clock, XCircle, FileText, ArrowRight } from 'lucide-react';
import InvoiceModal from './InvoiceModal';

// Mock Data
const mockTransactions = [
    { id: 'TRX-1001', client: 'Ravi Sharma', plan: 'Investor (Q)', amount: 29500, date: '2025-09-28', status: 'Success', method: 'UPI' },
    { id: 'TRX-1002', client: 'Priya Verma', plan: 'Trader (M)', amount: 9800, date: '2025-09-25', status: 'Pending', method: 'Card' },
    { id: 'TRX-1003', client: 'Amit Singh', plan: 'Trial', amount: 0, date: '2025-09-20', status: 'Success', method: 'Free' },
    { id: 'TRX-1004', client: 'Geeta Patil', plan: 'Ext. Trial', amount: 0, date: '2025-09-18', status: 'Success', method: 'Free' },
    { id: 'TRX-1005', client: 'Sanjay K.', plan: 'Investor (Y)', amount: 99000, date: '2025-09-15', status: 'Success', method: 'Bank Transfer' },
    { id: 'TRX-1006', client: 'Sneha Reddy', plan: 'Trader (Q)', amount: 24500, date: '2025-09-10', status: 'Failed', method: 'Netbanking' },
    // Add more for pagination
    ...Array(15).fill(null).map((_, i) => ({
        id: `TRX-${1007 + i}`,
        client: `Client ${i + 7}`,
        plan: i % 3 === 0 ? 'Investor (M)' : i % 3 === 1 ? 'Trader (M)' : 'Investor (Q)',
        amount: (i + 1) * 5000 + 5000,
        date: `2025-09-${i < 9 ? '0' + (9 - i) : 9 - i}`,
        status: i % 4 === 0 ? 'Pending' : i % 4 === 1 ? 'Failed' : 'Success',
        method: i % 2 === 0 ? 'UPI' : 'Card',
    }))
];

const ITEMS_PER_PAGE = 10;

// Helper to get status badge class
const getStatusBadge = (status) => {
    switch (status) {
        case 'Success': return 'bg-success';
        case 'Pending': return 'bg-warning text-dark';
        case 'Failed': return 'bg-danger';
        default: return 'bg-secondary';
    }
};

const Payments = () => {
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);

    const handleOpenInvoiceModal = () => setShowInvoiceModal(true);
    const handleCloseInvoiceModal = () => setShowInvoiceModal(false);

    // --- Filtering and Searching Logic ---
    const filteredTransactions = useMemo(() => {
        return mockTransactions
            .filter(trx => {
                const searchMatch = trx.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    trx.id.toLowerCase().includes(searchTerm.toLowerCase());
                
                const statusMatch = filterStatus === 'All' || trx.status === filterStatus;

                return searchMatch && statusMatch;
            });
    }, [searchTerm, filterStatus]);

    // --- Pagination Logic ---
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredTransactions, currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    
    // --- Confirmation Status Metrics ---
    const totalTransactions = mockTransactions.length;
    const successCount = mockTransactions.filter(t => t.status === 'Success').length;
    const pendingCount = mockTransactions.filter(t => t.status === 'Pending').length;
    const failedCount = mockTransactions.filter(t => t.status === 'Failed').length;


    return (
        <div className="page-content">
            <h2 className="mb-4">💳 Payments & Invoices</h2>
            
            {/* Payment Confirmation Status */}
            <Row className="mb-4">
                <Col md={12}>
                    <h5>Payment Confirmation Status Overview</h5>
                </Col>
                <Col lg={4} md={6}>
                    <Card className="text-white bg-success">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title className="h3 mb-0">{successCount}</Card.Title>
                                    <Card.Text>Successful Payments</Card.Text>
                                </div>
                                <CheckCircle size={48} opacity={0.7} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={6}>
                    <Card className="text-white bg-warning text-dark">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title className="h3 mb-0">{pendingCount}</Card.Title>
                                    <Card.Text>Pending Confirmations</Card.Text>
                                </div>
                                <Clock size={48} opacity={0.7} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4} md={6}>
                    <Card className="text-white bg-danger">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title className="h3 mb-0">{failedCount}</Card.Title>
                                    <Card.Text>Failed/Rejected Payments</Card.Text>
                                </div>
                                <XCircle size={48} opacity={0.7} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* All Transactions Table */}
            <Card>
                <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">All Transactions List ({filteredTransactions.length})</h5>
                    {/* <Button variant="outline-secondary" size="sm">
                        <RefreshCw className="lucide-icon me-2" /> Refresh Data
                    </Button> */}
                </Card.Header>
                <Card.Body>
                    {/* Search and Filter Row */}
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group className="d-flex">
                                <Search className="lucide-icon me-2 mt-2 text-secondary" />
                                <Form.Control
                                    type="text"
                                    placeholder="Search by ID or Client Name..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="d-flex">
                                <Filter className="lucide-icon me-2 mt-2 text-secondary" />
                                <Form.Select
                                    value={filterStatus}
                                    onChange={(e) => {
                                        setFilterStatus(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Success">Success</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Failed">Failed</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        {/* <Col md={3} className="d-flex align-items-center justify-content-end">
                            <Button variant="outline-info" size="sm" onClick={handleOpenInvoiceModal}>
                                <FileText className="lucide-icon me-2" /> Generate Invoice
                            </Button>
                        </Col> */}
                    </Row>

                    {/* Transactions Table */}
                    <Table responsive hover className="align-middle">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Client Name</th>
                                <th>Plan</th>
                                <th>Amount (₹)</th>
                                <th>Date</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTransactions.length > 0 ? (
                                paginatedTransactions.map((trx) => (
                                    <tr key={trx.id}>
                                        <td><strong>{trx.id}</strong></td>
                                        <td>{trx.client}</td>
                                        <td><span className="badge bg-light text-dark">{trx.plan}</span></td>
                                        <td>₹{trx.amount.toLocaleString('en-IN')}</td>
                                        <td>{trx.date}</td>
                                        <td>{trx.method}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(trx.status)}`}>
                                                {trx.status}
                                            </span>
                                        </td>
                                        <td>
                                            <Button variant="outline-primary" size="sm" title="View Invoice" onClick={handleOpenInvoiceModal}>
                                                <FileText className="lucide-icon" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted py-4">No transactions found matching your search criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination>
                            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                            {[...Array(totalPages)].map((_, index) => (
                                <Pagination.Item 
                                    key={index + 1} 
                                    active={index + 1 === currentPage}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                        </Pagination>
                    </div>

                </Card.Body>
            </Card>

            {/* Invoice Modal */}
            <InvoiceModal 
                show={showInvoiceModal} 
                handleClose={handleCloseInvoiceModal} 
            />
        </div>
    );
};

export default Payments;
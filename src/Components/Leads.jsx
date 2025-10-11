import React, { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Form,
  Row,
  Col,
  Pagination,
  Modal,
} from 'react-bootstrap';
import { Search, Trash, Plus } from 'lucide-react';

// Mock Data (with Source)
const mockLeadsTable = [
  { id: 1, name: 'Ashok Varma', email: 'ashok@email.com', phone: '9000100020', status: 'New Lead', date: '2025-10-01', source: 'Web' },
  { id: 2, name: 'Simran Kaur', email: 'simran@email.com', phone: '9000100021', status: 'Contacted', date: '2025-09-30', source: 'Reference' },
  { id: 3, name: 'Vijay Patil', email: 'vijay@email.com', phone: '9000100022', status: 'Qualified', date: '2025-09-29', source: 'Add' },
  { id: 4, name: 'Neha Reddy', email: 'neha@email.com', phone: '9000100023', status: 'Converted', date: '2025-09-28', source: 'Web' },
  { id: 5, name: 'Rajesh S.', email: 'rajesh@email.com', phone: '9000100024', status: 'New Lead', date: '2025-09-27', source: 'Reference' },
  ...Array(15)
    .fill(null)
    .map((_, i) => ({
      id: 6 + i,
      name: `Lead Prospect ${i + 6}`,
      email: `lead${i + 6}@temp.com`,
      phone: `90001000${i + 30}`,
      status: i % 4 === 0 ? 'New Lead' : i % 4 === 1 ? 'Contacted' : i % 4 === 2 ? 'Qualified' : 'Converted',
      date: `2025-09-${(26 - i) < 10 ? '0' + (26 - i) : 26 - i}`,
      source: i % 3 === 0 ? 'Web' : i % 3 === 1 ? 'Add' : 'Reference',
    })),
];

const ITEMS_PER_PAGE = 10;

const statusOptions = [
  { label: 'All', color: 'light' },
  { label: 'New Lead', color: 'secondary' },
  { label: 'Contacted', color: 'warning text-dark' },
  { label: 'Qualified', color: 'primary' },
  { label: 'Converted', color: 'success' },
];

const Leads = () => {
  const [leads, setLeads] = useState(mockLeadsTable);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'Web',
  });

  const handleStatusChange = (id, newStatus) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    }
  };

  const handleAddLead = () => {
    if (!newLead.name || !newLead.email || !newLead.phone) {
      alert('Please fill all fields.');
      return;
    }

    const newId = leads.length ? Math.max(...leads.map((l) => l.id)) + 1 : 1;
    const date = new Date().toISOString().split('T')[0];

    const addedLead = {
      id: newId,
      ...newLead,
      status: 'New Lead',
      date,
    };

    setLeads([addedLead, ...leads]);
    setNewLead({ name: '', email: '', phone: '', source: 'Web' });
    setShowModal(false);
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchMatch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = statusFilter === 'All' || lead.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [leads, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLeads, currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="page-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">📈 Leads Management</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={18} className="me-2" /> Add Lead
        </Button>
      </div>

      <Card className="mt-4">
        <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0">All Leads </h5>
        </Card.Header>
        <Card.Body>
          {/* Filters */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group className="d-flex">
                <Search className="lucide-icon me-2 mt-2 text-secondary" />
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Select
                size="sm"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.label} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4} className="d-flex align-items-center justify-content-end">
              <span className="text-muted small">
                Showing {paginatedLeads.length} of {filteredLeads.length} leads
              </span>
            </Col>
          </Row>

          {/* Table */}
          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Name / Email</th>
                <th>Contact</th>
                <th>Date Added</th>
                <th>Status</th>
                <th>Source</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.length > 0 ? (
                paginatedLeads.map((lead) => {
                  const currentStatus = statusOptions.find(
                    (s) => s.label === lead.status
                  );
                  return (
                    <tr key={lead.id}>
                      <td>{lead.id}</td>
                      <td>
                        <strong>{lead.name}</strong>
                        <br />
                        <small className="text-muted">{lead.email}</small>
                      </td>
                      <td>{lead.phone}</td>
                      <td>{lead.date}</td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(lead.id, e.target.value)
                          }
                          style={{
                            border: 'none',
                            backgroundColor: `var(--bs-${
                              currentStatus?.color?.split(' ')[0]
                            })`,
                            color: currentStatus?.color?.includes('text-dark')
                              ? '#000'
                              : '#fff',
                            fontWeight: 600,
                            borderRadius: '6px',
                            textAlign: 'center',
                            width: '150px',
                          }}
                        >
                          {statusOptions
                            .filter((opt) => opt.label !== 'All')
                            .map((opt) => (
                              <option key={opt.label} value={opt.label}>
                                {opt.label}
                              </option>
                            ))}
                        </Form.Select>
                      </td>
                      <td>{lead.source}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(lead.id)}
                        >
                          <Trash size={16} /> Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </Card.Body>
      </Card>

      {/* Add Lead Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Lead</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={newLead.email}
                onChange={(e) =>
                  setNewLead({ ...newLead, email: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter contact number"
                value={newLead.phone}
                onChange={(e) =>
                  setNewLead({ ...newLead, phone: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Source</Form.Label>
              <Form.Select
                value={newLead.source}
                onChange={(e) =>
                  setNewLead({ ...newLead, source: e.target.value })
                }
              >
                <option value="Web">Web</option>
                <option value="Reference">Reference</option>
                <option value="Add">Add</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddLead}>
            Add Lead
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Leads;

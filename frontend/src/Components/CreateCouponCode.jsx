import React, { useState, useMemo } from "react";
import {
  Card,
  Table,
  Button,
  Form,
  Row,
  Col,
  Pagination,
  Badge,
  Modal,
} from "react-bootstrap";
import { PlusCircle, Search, Trash2, X } from "lucide-react";

// Function to generate unique coupon codes
const generateCouponCode = () => {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `RAISTOCK-${randomPart}`;
};

const ITEMS_PER_PAGE = 5;

const CreateCouponCode = () => {
  const [coupons, setCoupons] = useState([
    {
      code: "RAISTOCK-A12XK9",
      discount: "10%",
      validTill: "2025-12-31",
      used: false,
    },
    {
      code: "RAISTOCK-ZP91LQ",
      discount: "20%",
      validTill: "2025-11-30",
      used: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: generateCouponCode(),
    discount: "",
    validTill: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered data
  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [coupons, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE);
  const paginatedCoupons = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCoupons.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCoupons, currentPage]);

  // Handle Create Coupon
  const handleAddCoupon = () => {
    if (!newCoupon.discount || !newCoupon.validTill) return;
    setCoupons([...coupons, { ...newCoupon, used: false }]);
    setShowModal(false);
    setNewCoupon({
      code: generateCouponCode(),
      discount: "",
      validTill: "",
    });
  };

  // Handle Delete
  const handleDelete = (code) => {
    setCoupons(coupons.filter((c) => c.code !== code));
  };

  return (
    <div className="page-content">
      <h2 className="mb-4">🎟️ Coupon Code Management</h2>

      <Card>
        <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Generated Coupons</h5>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            className="d-flex align-items-center"
          >
            <PlusCircle size={18} className="me-2" /> Create Coupon
          </Button>
        </Card.Header>

        <Card.Body>
          {/* Search */}
          <Row className="mb-3">
            <Col md={5}>
              <Form.Group className="d-flex align-items-center">
                <Search className="me-2 text-secondary" size={18} />
                <Form.Control
                  type="text"
                  placeholder="Search by coupon code..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Coupon Table */}
          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Coupon Code</th>
                <th>Discount</th>
                <th>Valid Till</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCoupons.length > 0 ? (
                paginatedCoupons.map((coupon, index) => (
                  <tr key={coupon.code}>
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                    <td>
                      <strong>{coupon.code}</strong>
                    </td>
                    <td>{coupon.discount}</td>
                    <td>{coupon.validTill}</td>
                    <td>
                      <Badge bg={coupon.used ? "secondary" : "success"}>
                        {coupon.used ? "Used" : "Not Used"}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(coupon.code)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Create Coupon Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Coupon Code</Form.Label>
              <Form.Control type="text" value={newCoupon.code} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Discount (%)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter discount percentage"
                // value={newCoupon.discount}
                // onChange={(e) =>
                //   setNewCoupon({ ...newCoupon, discount: e.target.value + "%" })
                // }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Valid Till</Form.Label>
              <Form.Control
                type="date"
                value={newCoupon.validTill}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, validTill: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            <X size={16} className="me-1" /> Cancel
          </Button>
          <Button variant="primary" onClick={handleAddCoupon}>
            <PlusCircle size={16} className="me-1" /> Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateCouponCode;

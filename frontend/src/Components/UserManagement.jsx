import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Table, Button, Form, Row, Col, Pagination, Badge, Spinner, Alert } from "react-bootstrap";
import { UserPlus, Search, Pencil, Trash, Lock } from "lucide-react";
import {
  fetchUsers,
  deleteUserAsync,
  toggleUserStatus,
  updateCRMUser,
} from "../slices/crmuserSlice";
import UserFormModal from "./UserFormModal";
import AccessControl from "./AccessControl";

const ITEMS_PER_PAGE = 8;

const getRoleBadge = (role) => {
  switch (role) {
    case "Admin":
      return "danger";
    case "Manager":
      return "primary";
    case "Sales Executive":
      return "success";
    case "Support Agent":
      return "info";
    default:
      return "secondary";
  }
};

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.crmUsers);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // 🧾 Modal
  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  // 🗑️ Delete User
  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Are you sure you want to remove user ${userName}?`)) {
      dispatch(deleteUserAsync(userId));
    }
  };

  // 🔄 Suspend / Activate
  const handleToggleStatus = (user) => {
    dispatch(toggleUserStatus({ id: user._id, currentStatus: user.status }));
  };

  // ✏️ Handle Edit (modal will submit)
const handleEditUser = (updatedUserData) => {
  const { _id, name, email, role } = updatedUserData;
  dispatch(updateCRMUser({ id: _id, name, email, role }))
    .unwrap()
    .then(() => {
      handleCloseModal(); // ✅ close modal on success
      dispatch(fetchUsers()); // ✅ refresh user list
    })
    .catch((err) => console.error("Update failed:", err));
};

  // 🔍 Search + Pagination
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const term = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term)
      );
    });
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="page-content">
      <h2 className="mb-4">👨‍💼 User Management</h2>

      <Card>
        <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0">CRM Users ({filteredUsers.length})</h5>
          <Button variant="success" onClick={() => handleOpenModal()}>
            <UserPlus className="lucide-icon me-2" /> Add New User
          </Button>
        </Card.Header>

        <Card.Body>
          {/* 🔍 Search */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="d-flex">
                <Search className="lucide-icon me-2 mt-2 text-secondary" />
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex align-items-center justify-content-end">
              <span className="text-muted small">
                Total Active Users: {users.filter((u) => u.status === "Active").length}
              </span>
            </Col>
          </Row>

          {/* 🌀 Loading/Error */}
          {loading && (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading users...</p>
            </div>
          )}
          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}

          {/* 📋 Table */}
          {!loading && !error && (
            <Table responsive hover className="align-middle">
              <thead>
                <tr>
                  <th>Name / Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Added On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <strong>{user.name}</strong>
                        <br />
                        <small className="text-muted">{user.email}</small>
                      </td>
                      <td>
                        <Badge bg={getRoleBadge(user.role)}>{user.role}</Badge>
                      </td>
                      <td>
                        <Badge bg={user.status === "Active" ? "success" : "secondary"}>
                          {user.status || "N/A"}
                        </Badge>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-1"
                          title="Edit User"
                          onClick={() => handleOpenModal(user)}
                        >
                          <Pencil className="lucide-icon" />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="me-1"
                          title="Remove User"
                          onClick={() => handleDeleteUser(user._id, user.name)}
                        >
                          <Trash className="lucide-icon" />
                        </Button>
                        {/* <Button
                          variant={user.status === "Active" ? "outline-warning" : "outline-success"}
                          size="sm"
                          title="Suspend / Activate"
                          onClick={() => handleToggleStatus(user)}
                        >
                          <Lock className="lucide-icon" />
                        </Button> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      No CRM users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}

          {/* Pagination */}
          {!loading && filteredUsers.length > 0 && (
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
          )}
        </Card.Body>
      </Card>

      <AccessControl />
      <UserFormModal
        show={showModal}
        handleClose={handleCloseModal}
        userData={editingUser}
        onSubmit={handleEditUser}
      />
    </div>
  );
};

export default UserManagement;

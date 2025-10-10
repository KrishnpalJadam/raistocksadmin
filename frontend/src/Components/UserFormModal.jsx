import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { UserPlus, Save } from "lucide-react";
import { addUser } from "../slices/crmuserSlice";

// Accept an optional onSubmit prop (used for edit mode). When editing we should
// call the provided onSubmit instead of dispatching addUser which always hits
// the create endpoint.
const UserFormModal = ({ show, handleClose, userData, onSubmit }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Support Agent",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "Support Agent",
        password: "",
        confirmPassword: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "Support Agent",
        password: "",
        confirmPassword: "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditMode = !!userData;

    if (!isEditMode) {
      // Create new user: password fields are required
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      try {
        await dispatch(addUser(payload)).unwrap();
        alert("User added successfully!");
        handleClose();
      } catch (err) {
        alert(`Error: ${err}`);
      }
    } else {
      // Edit mode: call the provided onSubmit (UserManagement passes this prop)
      // Only send editable fields. Do not send empty password fields unless
      // the user filled them.
      const payload = {
        _id: userData._id,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      // include password only if user entered both fields
      if (formData.password || formData.confirmPassword) {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
        payload.password = formData.password;
        payload.confirmPassword = formData.confirmPassword;
      }

      try {
        if (typeof onSubmit === "function") {
          await onSubmit(payload);
        } else {
          // fallback: no onSubmit provided — alert and close
          console.warn("Edit submitted but no onSubmit handler provided");
        }
        alert("User updated successfully!");
        handleClose();
      } catch (err) {
        alert(`Error updating user: ${err}`);
      }
    }
  };

  const isEditMode = !!userData;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header
        closeButton
        className={`bg-${isEditMode ? "primary" : "success"} text-white`}
      >
        <Modal.Title>
          <UserPlus className="lucide-icon me-2" />{" "}
          {isEditMode ? "Edit CRM User" : "Add New CRM User"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Fields same as before */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email (Login ID)</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>User Role</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Admin">Admin (Full Access)</option>
              <option value="Manager">Manager (Supervisory)</option>
              <option value="Sales Executive">
                Sales Executive (Leads/Clients)
              </option>
              <option value="Support Agent">
                Support Agent (Support/Emails)
              </option>
            </Form.Select>
          </Form.Group>

          {!isEditMode && (
            <>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}

          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <Save className="lucide-icon me-2" />{" "}
              {isEditMode ? "Update User" : "Add User"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserFormModal;

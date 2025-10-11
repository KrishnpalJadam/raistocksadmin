// src/components/Settings/ResetPassword.jsx

import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { Lock, Save } from "lucide-react";

const Settings = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Password reset request submitted!");
  };

  return (
    <div className="page-content">
      <h2 className="mb-4">🔐 Reset Password</h2>

      <Card className="shadow-sm">
        <Card.Header className="bg-white border-bottom">
          <h5 className="mb-0">
            <Lock className="lucide-icon me-2" /> Change Your Password
          </h5>
          <p className="text-muted small mb-0">
            Update your account password below. Make sure it’s secure and unique.
          </p>
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                placeholder="Enter current password"
                value={passwords.currentPassword}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={passwords.newPassword}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Re-enter new password"
                value={passwords.confirmPassword}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit">
                <Save className="lucide-icon me-2" /> Update Password
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Settings;

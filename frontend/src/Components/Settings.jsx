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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      alert("Please fill all password fields.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      const token =
        (localStorage.getItem("login_details") &&
          JSON.parse(localStorage.getItem("login_details")).token) ||
        null;
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/users/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
            confirmPassword: passwords.confirmPassword,
          }),
        }
      );

      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Failed to update password");
      alert("Password updated successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert(`Error: ${err.message || err}`);
    }
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
            Update your account password below. Make sure it’s secure and
            unique.
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

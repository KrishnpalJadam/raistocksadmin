import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Badge,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import {
  RefreshCw,
  User,
  Mail,
  MessageSquare,
  Clock,
  XCircle,
  CheckCircle,
  Send,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTicketDetails, addTicketReply } from "../slices/supportSlice";
import axios from "axios";

const getStatusColor = (status) => {
  switch (status) {
    case "Resolved":
      return "success";
    case "In-progress":
      return "primary";
    case "Open":
      return "danger";
    default:
      return "secondary";
  }
};

const TicketDetailModal = ({ show, handleClose, ticketData }) => {
  const dispatch = useDispatch();
  const [currentStatus, setCurrentStatus] = useState(
    ticketData?.status || "Open"
  );
  const [newReply, setNewReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const { userId, user, token } = useSelector((state) => state.user);
  const [localReplies, setLocalReplies] = useState([]);

  const fullTicket = useSelector((state) =>
    state.support.tickets.find((t) => t._id === ticketData._id)
  );
  const replies = fullTicket?.replies || [];
    const API_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    if (ticketData) {
      console.log("🎟️ Ticket data received in modal:", ticketData);
      setCurrentStatus(ticketData.status || "Open");
    } else {
      console.log("⚠️ Modal rendered but no ticket data yet");
    }
  }, [ticketData]);
  useEffect(() => {
    if (ticketData) {
      console.log("🎟️ Ticket data received in modal:", ticketData);
      console.log(userId); // <-- add here
      setCurrentStatus(ticketData.status || "Open");
    } else {
      console.log("⚠️ Modal rendered but no ticket data yet");
    }
  }, [ticketData, user]);

  useEffect(() => {
    if (fullTicket?.replies) {
      setLocalReplies(fullTicket.replies);
    }
  }, [fullTicket?.replies]);
 
  const handleSendReply = async () => {
    if (!newReply.trim()) return;
    setSending(true);
    try {
      const result = await dispatch(
        addTicketReply({
          id: ticketData._id,
          message: newReply,
          senderId: userId, // use the ID from localStorage or Redux
        })
      ).unwrap();

      // ✅ Update localReplies immediately
      setLocalReplies(result.replies);

      setNewReply("");
    } catch (err) {
      console.error("Reply failed:", err);
      alert("Failed to send reply.");
    } finally {
      setSending(false);
    }
  };

  const StatusIcon =
    currentStatus === "Resolved"
      ? CheckCircle
      : currentStatus === "In-progress"
      ? RefreshCw
      : XCircle;

  if (!ticketData) return null;

 
 

 

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header
        closeButton
        className={`bg-${getStatusColor(currentStatus)} text-white`}
      >
        <Modal.Title>
          <MessageSquare className="lucide-icon me-2" /> Ticket #
          {ticketData.ticketId} - {ticketData.subject}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {/* Ticket Info */}
          <Col lg={4} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h5>Ticket Information</h5>
                <p className="text-muted small border-bottom pb-2">
                  Client Details
                </p>
                <p>
                  <User className="lucide-icon me-2 text-primary" />{" "}
                  <strong>Client:</strong> {ticketData.client}
                </p>
                <p>
                  <Mail className="lucide-icon me-2 text-primary" />{" "}
                  <strong>Email:</strong> {ticketData.email}
                </p>
                <p>
                  <Clock className="lucide-icon me-2 text-primary" />{" "}
                  <strong>Opened:</strong> {ticketData.opened?.substring(0, 10)}
                </p>
                <p>
                  <MessageSquare className="lucide-icon me-2 text-primary" />{" "}
                  <strong>Category:</strong>{" "}
                  <Badge bg="light" text="dark" className="ms-2">
                    {ticketData.category}
                  </Badge>
                </p>

                <hr />

                {/* Status */}
                <Form.Group className="mb-3">
                  <Form.Label className="d-block">
                    <StatusIcon
                      className={`lucide-icon me-2 text-${getStatusColor(
                        currentStatus
                      )}`}
                    />
                    <strong>Current Status</strong>
                  </Form.Label>
                  <Form.Select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="In-progress">In-progress</option>
                    <option value="Resolved">Resolved</option>
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          {/* Replies */}
          <Col lg={8}>
            <h5>Ticket Thread</h5>
            <div
              className="ticket-thread border p-3 rounded"
              style={{ maxHeight: "350px", overflowY: "auto" }}
            >
              {loadingReplies ? (
                <p className="text-center text-muted">
                  Loading conversation...
                </p>
              ) : localReplies.length === 0 ? (
                <p className="text-center text-muted">No replies yet.</p>
              ) : (
localReplies
  .slice()
  .reverse()
  .map((reply, index) => {
    const isCurrentUser = reply.senderId._id === userId;
    const senderName = isCurrentUser
      ? user?.name || "You"
      : reply.name || reply.senderId?.name || "Unknown";
  

    return (
      <div
        key={index}
        className={`mb-3 p-3 rounded ${
          isCurrentUser
            ? "bg-light border"
            : "bg-white border border-primary border-opacity-25"
        }`}
      >
        <p className="mb-1">
          <small className="text-muted float-end">
            {new Date(reply.timestamp || reply.createdAt).toLocaleString()}
          </small>
          <strong>{senderName}</strong> &nbsp;
        </p>
        <p className="mb-0">{reply.message}</p>
      </div>
    );
  })
              )}

              <div className="p-3 mb-3 bg-secondary bg-opacity-10 rounded">
                <p className="mb-0 small text-muted">
                  <strong>Original Message:</strong> {ticketData.subject}
                </p>
              </div>
            </div>

            {/* Admin Reply Form */}
            <Card className="mt-3">
              <Card.Body>
                <h6>Admin Reply</h6>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Type your response to the client..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    disabled={sending}
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    onClick={handleSendReply}
                    disabled={!newReply.trim() || sending}
                  >
                    {sending ? (
                      <Spinner animation="border" size="sm" className="me-2" />
                    ) : (
                      <Send className="lucide-icon me-2" />
                    )}{" "}
                    Send Update
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TicketDetailModal;

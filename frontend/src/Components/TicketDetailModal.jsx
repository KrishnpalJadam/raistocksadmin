// // // src/components/Support/TicketDetailModal.jsx

// // import React, { useState, useEffect } from 'react';
// // import { Modal, Button, Form, Badge, Row, Col, Card } from 'react-bootstrap';
// // import { RefreshCw, User, Mail, MessageSquare, Clock, XCircle, CheckCircle, Send } from 'lucide-react';
// // import { addTicketReply,getTicketReplies } from '../slices/supportSlice';
// // import { useDispatch, useSelector } from 'react-redux';

// // const mockReplies = [
// //     { id: 1, sender: 'Admin User', content: 'Thank you for reaching out. We are investigating the issue with your dashboard access now.', date: '2025-10-01 10:00' },
  
// // ];

// // const getStatusColor = (status) => {
// //     switch (status) {
// //         case 'Resolved': return 'success';
// //         case 'In-progress': return 'primary';
// //         case 'Open': return 'danger';
// //         default: return 'secondary';
// //     }
// // };

// // const TicketDetailModal = ({ show, handleClose, ticketData }) => {
// //     const [currentStatus, setCurrentStatus] = useState(ticketData ? ticketData.status : 'Open');
// //     const [newReply, setNewReply] = useState('');

// //     const dispatch = useDispatch();
// //     useEffect(() => {
// //         if (ticketData) {
// //             setCurrentStatus(ticketData.status);
// //         }
// //     }, [ticketData]);

// //     if (!ticketData) return null; // Don't render if no ticket is passed

// //     // const handleStatusUpdate = (e) => {
// //     //     const newStatus = e.target.value;
// //     //     setCurrentStatus(newStatus);
// //     //     console.log(`Ticket ${ticketData.id} status updated to: ${newStatus}`);
// //     //     // In a real app, this would trigger an API call
// //     // };

// //     const handleSendReply = () => {
// //         if (newReply.trim() === '') return;
// //         console.log(`Sending reply to Ticket ${ticketData.id}: ${newReply}`);
// //         setNewReply('');
// //         alert(`Reply sent to ${ticketData.client}.`);
// //         // In a real app, mockReplies would be updated with the new reply
// //     };

// //     const StatusIcon = currentStatus === 'Resolved' ? CheckCircle : currentStatus === 'In-progress' ? RefreshCw : XCircle;

// //     return (
// //         <Modal show={show} onHide={handleClose} size="xl" centered>
// //             <Modal.Header closeButton className={`bg-${getStatusColor(currentStatus)} text-white`}>
// //                 <Modal.Title><MessageSquare className="lucide-icon me-2" /> Ticket #{ticketData._id} - {ticketData.subject}</Modal.Title>
// //             </Modal.Header>
// //             <Modal.Body>
// //                 <Row>
// //                     {/* Ticket Details Column */}
// //                     <Col lg={4} className="mb-4">
// //                         <Card className="shadow-sm border-0">
// //                             <Card.Body>
// //                                 <h5>Ticket Information</h5>
// //                                 <p className="text-muted small border-bottom pb-2">Client Details</p>
                                
// //                                 <p><User className="lucide-icon me-2 text-primary" /> Client: {ticketData.client}</p>
// //                                 <p><Mail className="lucide-icon me-2 text-primary" /> Email: {ticketData.email}</p>
// //                                 <p><Clock className="lucide-icon me-2 text-primary" /> Opened: {ticketData.date}</p>
// //                                 <p>
// //                                     <MessageSquare className="lucide-icon me-2 text-primary" /> Category: <Badge bg="light" text="dark" className="ms-2">{ticketData.category}</Badge>
// //                                 </p>

// //                                 <hr/>

// //                                 {/* Status Update Control */}
// //                                 {/* <Form.Group className="mb-3">
// //                                     <Form.Label className="d-block">
// //                                         <StatusIcon className={`lucide-icon me-2 text-${getStatusColor(currentStatus)}`} />
// //                                         **Current Status**
// //                                     </Form.Label>
// //                                     <Form.Select value={currentStatus} onChange={handleStatusUpdate}>
// //                                         <option value="Open">Open</option>
// //                                         <option value="In-progress">In-progress</option>
// //                                         <option value="Resolved">Resolved</option>
// //                                     </Form.Select>
// //                                 </Form.Group> */}
// //                             </Card.Body>
// //                         </Card>
// //                     </Col>

// //                     {/* Thread/Reply Column */}
// //                     <Col lg={8}>
// //                         <h5>Ticket Thread</h5>
// //                         <div className="ticket-thread border p-3 rounded" style={{ maxHeight: '350px', overflowY: 'auto' }}>
// //                             {mockReplies.slice().reverse().map((reply, index) => (
// //                                 <div key={index} className={`mb-3 p-3 rounded ${reply.sender.includes('Admin') ? 'bg-light border' : 'bg-white border border-primary border-opacity-25'}`}>
// //                                     <p className="mb-1">
// //                                         <small className="text-muted float-end">{reply.date}</small>
// //                                         <strong>{reply.sender}</strong>
// //                                     </p>
// //                                     <p className="mb-0">{reply.content}</p>
// //                                 </div>
// //                             ))}
                          
// //                         </div>

// //                         {/* Admin Reply Form */}
// //                         <Card className="mt-3">
// //                             <Card.Body>
// //                                 <h6>Reply</h6>
// //                                 <Form.Group className="mb-3">
// //                                     <Form.Control 
// //                                         as="textarea" 
// //                                         rows={3} 
// //                                         placeholder="Type your response to the client..."
// //                                         value={newReply}
// //                                         onChange={(e) => setNewReply(e.target.value)}
// //                                     />
// //                                 </Form.Group>
// //                                 <div className="d-flex justify-content-end">
// //                                     <Button variant="primary" onClick={handleSendReply} disabled={newReply.trim() === ''}>
// //                                         <Send className="lucide-icon me-2" /> Send Update
// //                                     </Button>
// //                                 </div>
// //                             </Card.Body>
// //                         </Card>
// //                     </Col>
// //                 </Row>
// //             </Modal.Body>
// //             <Modal.Footer>
// //                 <Button variant="secondary" onClick={handleClose}>
// //                     Close
// //                 </Button>
// //             </Modal.Footer>
// //         </Modal>
// //     );
// // };

// // export default TicketDetailModal;
// // src/components/Support/TicketDetailModal.jsx

// import React, { useState, useEffect } from 'react';
// import { Modal, Button, Form, Badge, Row, Col, Card, Spinner } from 'react-bootstrap';
// import { RefreshCw, User, Mail, MessageSquare, Clock, XCircle, CheckCircle, Send } from 'lucide-react';
// // import { addTicketReply, getTicketReplies } from '../../redux/supportSlice';
// import { addTicketReply, getTicketReplies } from '../slices/supportSlice';
// import { useDispatch, useSelector } from 'react-redux';

// const getStatusColor = (status) => {
//     switch (status) {
//         case 'Resolved': return 'success';
//         case 'In-progress': return 'primary';
//         case 'Open': return 'danger';
//         default: return 'secondary';
//     }
// };

// const TicketDetailModal = ({ show, handleClose, ticketData }) => {
//     const [currentStatus, setCurrentStatus] = useState(ticketData ? ticketData.status : 'Open');
//     const [newReply, setNewReply] = useState('');

//     const dispatch = useDispatch();
//     const { replies, replyLoading } = useSelector((state) => state.support);

//     const ticketReplies = replies[ticketData?._id] || [];
//     // On Modal Open -> Fetch Replies
//     useEffect(() => {
//         if (ticketData?._id) {
//             dispatch(getTicketReplies(ticketData._id));
//         }
//     }, [ticketData, dispatch]);

//     const handleSendReply = async () => {
//         if (!newReply.trim()) return;

//         const senderId =  localStorage.getItem('user_id') || ''; // Or get from auth
//         if (!senderId) {
//             alert("Sender ID missing. Login again.");
//             return;
//         }

//         await dispatch(addTicketReply({
//             id: ticketData._id,
//             message: newReply,
//             senderId
//         }));

//         // Refresh replies
//         dispatch(getTicketReplies(ticketData._id));

//         setNewReply('');
//     };

//     if (!ticketData) return null;

//     const StatusIcon = currentStatus === 'Resolved'
//         ? CheckCircle
//         : currentStatus === 'In-progress'
//         ? RefreshCw
//         : XCircle;

//     return (
//         <Modal show={show} onHide={handleClose} size="xl" centered>
//             <Modal.Header closeButton className={`bg-${getStatusColor(currentStatus)} text-white`}>
//                 <Modal.Title>
//                     <MessageSquare className="lucide-icon me-2" /> 
//                     Ticket #{ticketData._id} - {ticketData.subject}
//                 </Modal.Title>
//             </Modal.Header>
            
//             <Modal.Body>
//                 <Row>
//                     <Col lg={4} className="mb-4">
//                         <Card className="shadow-sm border-0">
//                             <Card.Body>
//                                 <h5>Ticket Information</h5>
//                                 <p className="text-muted small border-bottom pb-2">Client Details</p>

//                                 <p><User className="lucide-icon me-2 text-primary" /> Client: {ticketData.client}</p>
//                                 <p><Mail className="lucide-icon me-2 text-primary" /> Email: {ticketData.email}</p>
//                                 <p><Clock className="lucide-icon me-2 text-primary" /> Opened: {ticketData.date}</p>
//                                 <p>
//                                     <MessageSquare className="lucide-icon me-2 text-primary" /> Category:
//                                     <Badge bg="light" text="dark" className="ms-2">
//                                         {ticketData.category}
//                                     </Badge>
//                                 </p>
//                                 <hr />
//                             </Card.Body>
//                         </Card>
//                     </Col>

//                     <Col lg={8}>
//                         <h5>Ticket Thread</h5>

//                         <div
//                             className="ticket-thread border p-3 rounded"
//                             style={{ maxHeight: '350px', overflowY: 'auto' }}
//                         >
//                             {replyLoading && (
//                                 <div className="text-center p-2">
//                                     <Spinner animation="border" size="sm" /> Loading replies...
//                                 </div>
//                             )}

//                             {!replyLoading && ticketReplies.length === 0 && (
//                                 <p className="text-center text-muted">No replies yet.</p>
//                             )}

//                             {[...ticketReplies].reverse().map((reply, index) => (
//                                 <div
//                                     key={index}
//                                     className={`
//                                         mb-3 p-3 rounded 
//                                         ${reply.senderId ? 'bg-light border' : 'bg-white border border-primary border-opacity-25'}
//                                     `}
//                                 >
//                                     <p className="mb-1">
//                                         <small className="text-muted float-end">
//                                             {new Date(reply.createdAt).toLocaleString()}
//                                         </small>
//                                         <strong>{reply.name || "User"}</strong>
//                                     </p>
//                                     <p className="mb-0">{reply.message}</p>
//                                 </div>
//                             ))}
//                         </div>

//                         <Card className="mt-3">
//                             <Card.Body>
//                                 <h6>Reply</h6>
//                                 <Form.Group className="mb-3">
//                                     <Form.Control
//                                         as="textarea"
//                                         rows={3}
//                                         placeholder="Type your response..."
//                                         value={newReply}
//                                         onChange={(e) => setNewReply(e.target.value)}
//                                     />
//                                 </Form.Group>
//                                 <div className="d-flex justify-content-end">
//                                     <Button
//                                         variant="primary"
//                                         onClick={handleSendReply}
//                                         disabled={newReply.trim() === '' || replyLoading}
//                                     >
//                                         <Send className="lucide-icon me-2" /> Send Reply
//                                     </Button>
//                                 </div>
//                             </Card.Body>
//                         </Card>
//                     </Col>
//                 </Row>
//             </Modal.Body>

//             <Modal.Footer>
//                 <Button variant="secondary" onClick={handleClose}>Close</Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };

// export default TicketDetailModal;
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
import { fetchTicketDetails, addTicketReply , fetchTicketReplies } from "../slices/supportSlice";
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
//   const {  user, token } = useSelector((state) => state.user);
useEffect(()=>{
   dispatch(fetchTicketDetails())
   dispatch(fetchTicketReplies(ticketData._id));

},[])
const reply = useSelector((state)=>state?.support)
  const [localReplies, setLocalReplies] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("login_details"));
  const user = userDetails?.data;
// console.log("userDet",userDetails?.data)
//    const user = {
//         id: "69131995026801b57d6542fa",
//         name: "Ankit Verma",
//         email: "ankitverma3490@gmail.com",
//         role: "Admin",
//         status: "Active"
//     }
  const fullTicket = useSelector((state) =>
    state.support.tickets.find((t) => t._id === ticketData._id)
  );
  const replies = fullTicket?.replies || [];
    const API_URL = import.meta.env.VITE_API_URL;

 const userId = localStorage.getItem("user_id");
  useEffect(() => {
    if (ticketData) {
      setCurrentStatus(ticketData.status || "Open");
    } else {
      console.log("⚠️ Modal rendered but no ticket data yet");
    }
  }, [ticketData]);
  useEffect(() => {
    if (ticketData) {
      setCurrentStatus(ticketData.status || "Open");
    } else {
      console.log("⚠️ Modal rendered but no ticket data yet");
    }
  }, [ticketData]);

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
                {/* <Form.Group className="mb-3">
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
                </Form.Group> */}
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
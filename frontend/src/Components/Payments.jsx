// import React, { useState, useMemo, useEffect } from "react";
// import {
//   Card,
//   Table,
//   Button,
//   Form,
//   Row,
//   Col,
//   Pagination,
//   Spinner,
// } from "react-bootstrap";
// import {
//   Search,
//   Filter,
//   CheckCircle,
//   Clock,
//   XCircle,
//   FileText,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchPayments } from "../slices/paymentSlice";
// import InvoiceModal from "./InvoiceModal";
// import axios from "axios";
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// // --- Helper to get status badge class
// const getStatusBadge = (status) => {
//   switch (status) {
//     case "Success":
//       return "bg-success";
//     case "Pending":
//       return "bg-warning text-dark";
//     case "Failed":
//       return "bg-danger";
//     default:
//       return "bg-secondary";
//   }
// };

// // --- Helper to format date
// const formatDate = (isoString) => {
//   const date = new Date(isoString);
//   const options = { day: "2-digit", month: "short", year: "numeric" };
//   return date.toLocaleDateString("en-GB", options); // 05 Nov 2025
// };

// const ITEMS_PER_PAGE = 10;

// const Payments = () => {
//   const dispatch = useDispatch();
//   const {
//     list: transactions,
//     loading,
//     error,
//   } = useSelector((state) => state.payments);
//   console.log("Transactions:", transactions);

//   const [showInvoiceModal, setShowInvoiceModal] = useState(false);
//   const [invoiceData, setInvoiceData] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);

//   const handleOpenInvoiceModal = async (clientId) => {
//     try {
//       const { data } = await axios.get(
//         `${API_URL}/api/invoice/${clientId}`
//       );
//       setInvoiceData(data);
//       setShowInvoiceModal(true);
//     } catch (err) {
//       console.error("Error fetching invoice:", err);
//       alert("Failed to fetch invoice.");
//     }
//   };
//   const handleCloseInvoiceModal = () => setShowInvoiceModal(false);

//   useEffect(() => {
//     dispatch(fetchPayments());
//   }, [dispatch]);

//   // --- Search + Filter
//   const filteredTransactions = useMemo(() => {
//     return transactions.filter((trx) => {
//       const searchMatch =
//         trx.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         trx.clientId?.toLowerCase().includes(searchTerm.toLowerCase());
//       const statusMatch = filterStatus === "All" || trx.status === filterStatus;
//       return searchMatch && statusMatch;
//     });
//   }, [transactions, searchTerm, filterStatus]);

//   // --- Pagination
//   const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
//   const paginatedTransactions = filteredTransactions.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE
//   );

//   const handlePageChange = (pageNumber) => {
//     if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
//   };

//   // --- Status Count Cards (dynamic)
//   const successCount = transactions.filter(
//     (t) => t.status === "Success"
//   ).length;
//   const pendingCount = transactions.filter(
//     (t) => t.status === "Pending"
//   ).length;
//   const failedCount = transactions.filter((t) => t.status === "Failed").length;

//   // --- Loading & Error UI
//   if (loading)
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" /> <p>Loading payments...</p>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="text-danger text-center py-5">
//         ❌ Failed to load payments: {error}
//       </div>
//     );

//   return (
//     <div className="page-content">
//       <h2 className="mb-4">💳 Payments & Invoices</h2>

//       {/* --- Payment Confirmation Status --- */}
//       <Row className="mb-4">
//         <Col md={12}>
//           <h5>Payment Confirmation Status Overview</h5>
//         </Col>

//         <Col lg={4} md={6}>
//           <Card className="text-white bg-success">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <Card.Title className="h3 mb-0">{successCount}</Card.Title>
//                   <Card.Text>Successful Payments</Card.Text>
//                 </div>
//                 <CheckCircle size={48} opacity={0.7} />
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col lg={4} md={6}>
//           <Card className="text-white bg-warning text-dark">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <Card.Title className="h3 mb-0">{pendingCount}</Card.Title>
//                   <Card.Text>Pending Confirmations</Card.Text>
//                 </div>
//                 <Clock size={48} opacity={0.7} />
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col lg={4} md={6}>
//           <Card className="text-white bg-danger">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <Card.Title className="h3 mb-0">{failedCount}</Card.Title>
//                   <Card.Text>Failed/Rejected Payments</Card.Text>
//                 </div>
//                 <XCircle size={48} opacity={0.7} />
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* --- Transactions Table --- */}
//       <Card>
//         <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
//           <h5 className="mb-0">
//             All Transactions List ({filteredTransactions.length})
//           </h5>
//         </Card.Header>
//         <Card.Body>
//           {/* --- Search & Filter --- */}
//           <Row className="mb-3">
//             <Col md={6}>
//               <Form.Group className="d-flex">
//                 <Search className="lucide-icon me-2 mt-2 text-secondary" />
//                 <Form.Control
//                   type="text"
//                   placeholder="Search by ID or Client Name..."
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setSearchTerm(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                 />
//               </Form.Group>
//             </Col>

//             <Col md={3}>
//               <Form.Group className="d-flex">
//                 <Filter className="lucide-icon me-2 mt-2 text-secondary" />
//                 <Form.Select
//                   value={filterStatus}
//                   onChange={(e) => {
//                     setFilterStatus(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                 >
//                   <option value="All">All Statuses</option>
//                   <option value="Success">Success</option>
//                   <option value="Pending">Pending</option>
//                   <option value="Failed">Failed</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* --- Table --- */}
//           <Table responsive hover className="align-middle text-nowrap">
//             <thead>
//               <tr>
//                 <th>Transaction ID</th>
//                 <th>Client Name</th>
//                 <th>Plan</th>
//                 <th>Amount (₹)</th>
//                 <th>Date</th>
//                 <th>Method</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedTransactions.length > 0 ? (
//                 paginatedTransactions.map((trx) => (
//                   <tr key={trx._id}>
//                     <td>
//                       <strong>{trx.razorpayPaymentId || "—"}</strong>
//                     </td>
//                     <td>{trx.name}</td>
//                     <td>
//                       <span className="badge bg-light text-dark">
//                         {trx.subscription} ({trx.planType})
//                       </span>
//                     </td>
//                     <td>₹{trx?.amount}</td>
//                     <td>{formatDate(trx.updatedAt)}</td>
//                     <td>{trx.method}</td>
//                     <td>
//                       <span className={`badge ${getStatusBadge(trx.status)}`}>
//                         {trx.status}
//                       </span>
//                     </td>
//                     <td>
//                       <Button
//                         variant="outline-primary"
//                         size="sm"
//                         title="View Invoice"
//                         onClick={() => handleOpenInvoiceModal(trx.clientId)} // ✅ clientId
//                       >
//                         <FileText className="lucide-icon" />
//                       </Button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="text-center text-muted py-4">
//                     No transactions found matching your search criteria.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>

//           {/* --- Pagination --- */}
//           <div className="d-flex justify-content-center mt-4">
//             <Pagination>
//               <Pagination.First
//                 onClick={() => handlePageChange(1)}
//                 disabled={currentPage === 1}
//               />
//               <Pagination.Prev
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//               />
//               {[...Array(totalPages)].map((_, index) => (
//                 <Pagination.Item
//                   key={index + 1}
//                   active={index + 1 === currentPage}
//                   onClick={() => handlePageChange(index + 1)}
//                 >
//                   {index + 1}
//                 </Pagination.Item>
//               ))}
//               <Pagination.Next
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//               />
//               <Pagination.Last
//                 onClick={() => handlePageChange(totalPages)}
//                 disabled={currentPage === totalPages}
//               />
//             </Pagination>
//           </div>
//         </Card.Body>
//       </Card>

//       {/* --- Invoice Modal --- */}
//       <InvoiceModal
//         show={showInvoiceModal}
//         handleClose={handleCloseInvoiceModal}
//         invoiceData={invoiceData}
//       />
//     </div>
//   );
// };

// export default Payments;

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Form,
  Row,
  Col,
  Pagination,
  Spinner,
} from "react-bootstrap";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments } from "../slices/paymentSlice";
import InvoiceModal from "./InvoiceModal";
import axios from "axios";
import { fetchAllInvoices,fetchInvoiceById } from "../slices/invoiceSlice";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// --- Helper to get status badge class
const getStatusBadge = (status) => {
  switch (status) {
    case "Success":
      return "bg-success";
    case "Pending":
      return "bg-warning text-dark";
    case "Failed":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
};

// --- Helper to format date
const formatDate = (isoString) => {
  const date = new Date(isoString);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options); // 05 Nov 2025
};

const ITEMS_PER_PAGE = 10;

const Payments = () => {
  const dispatch = useDispatch();
  const {
    list: transactions,
    loading,
    error,
  } = useSelector((state) => state.payments);
  // console.log("Transactions:", transactions);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const handleOpenInvoiceModal = async (invoiceId) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/invoice/${invoiceId}`);
      setInvoiceData(data);
      setShowInvoiceModal(true);
    } catch (err) {
      console.error("Error fetching invoice:", err);
      alert("Failed to fetch invoice.");
    }
  };
  const handleCloseInvoiceModal = () => setShowInvoiceModal(false);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);
  useEffect(()=>{
     dispatch(fetchAllInvoices())
  },[])
  const invoices = useSelector((state)=>state?.invoices?.invoices)
  console.log(invoices)
  // const flattenedTransactions = useMemo(() => {
  //   let list = [];

  //   transactions.forEach((client) => {
  //     if (client.paymentHistory && client.paymentHistory.length > 0) {
  //       client.paymentHistory.forEach((pay) => {
  //         list.push({
  //           ...pay,
  //           clientId: client.clientId,
  //           name: client.name,
  //           subscription: client.subscription,
  //           planType: client.planType,
  //           updatedAt: pay.date,
  //           invoiceId: pay.invoiceId,
  //         });
  //       });
  //     }
  //   });

  //   return list;
  // }, [transactions]);

  // --- Search + Filter
  
  const filteredTransactions = useMemo(() => {
  if (!invoices || invoices.length === 0) return [];

  return invoices.filter((inv) => {
    const searchLower = searchTerm.toLowerCase();

    const searchMatch =
      inv.clientName.toLowerCase().includes(searchLower) ||
      inv.paymentId?.toLowerCase().includes(searchLower) ||
      inv.id?.toLowerCase().includes(searchLower);

    const statusMatch =
      filterStatus === "All" || inv.status === filterStatus;

    return searchMatch && statusMatch;
  });
}, [invoices, searchTerm, filterStatus]);

  // --- Pagination
 const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

const paginatedTransactions = filteredTransactions.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  // --- Status Count Cards (dynamic)
  // const successCount = transactions.filter(
  //   (t) => t.status === "Success"
  // ).length;
  // const pendingCount = transactions.filter(
  //   (t) => t.status === "Pending"
  // ).length;
  // const failedCount = transactions.filter((t) => t.status === "Failed").length;

  // --- Loading & Error UI
  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" /> <p>Loading payments...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-danger text-center py-5">
        ❌ Failed to load payments: {error}
      </div>
    );

  return (
    <div className="page-content">
      <h2 className="mb-4">💳 Payments & Invoices</h2>

      {/* --- Payment Confirmation Status --- */}
      {/* <Row className="mb-4">
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
      </Row> */}

      {/* --- Transactions Table --- */}
      <Card>
        <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            All Transactions List ({paginatedTransactions?.length})
          </h5>
        </Card.Header>
        <Card.Body>
          {/* --- Search & Filter --- */}
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
          </Row>

          {/* --- Table --- */}
          <Table responsive hover className="align-middle text-nowrap">
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
              {paginatedTransactions?.length > 0 ? (
                paginatedTransactions?.map((trx) => (
                  <tr key={trx._id}>
                    <td>
                      <strong>{trx.paymentId}</strong>
                    </td>

                    {/* Client Name */}
                    <td>{trx.clientName}</td>

                    {/* Plan */}
                    <td>
                      <span className="badge bg-light text-dark">
                        {trx.subscription} ({trx.planType})
                      </span>
                    </td>

                    {/* Amount */}
                    <td>₹{trx.totalAmount}</td>

                    {/* Date */}
                    <td>{formatDate(trx.date)}</td>

                    {/* Method */}
                    <td>{trx.method}</td>

                    {/* Status */}
                    <td>
                      <span className={`badge ${getStatusBadge(trx.status)}`}>
                        {trx.status}
                      </span>
                    </td>

                    {/* Invoice Button */}
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        title="View Invoice"
                        onClick={() =>
                          handleOpenInvoiceModal(
                            encodeURIComponent(trx.id)
                          )
                        }
                      >
                        <FileText className="lucide-icon" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">
                    No transactions found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* --- Pagination --- */}
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

      {/* --- Invoice Modal --- */}
      <InvoiceModal
        show={showInvoiceModal}
        handleClose={handleCloseInvoiceModal}
        invoiceData={invoiceData}
      />
    </div>
  );
};

export default Payments;

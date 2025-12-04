import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Edit, Eye, FileText } from "lucide-react";
import { Card, Pagination, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./clint.css";
import { useMemo } from "react";
import {  fetchClients } from "../../slices/clientSlice";

const getSubscriptionBadge = (sub) => {
  let color;
  switch (sub) {
    case "Trial":
      color = "secondary";
      break;
    case "Extended Trial":
      color = "warning";
      break;
    case "Investor":
      color = "info";
      break;
    case "Trader":
      color = "primary";
      break;
    case "Trader Premium":
      color = "success";
    case "Custom":
      color = "success";
    case "Trial Plan":
      color = "success";
   
      break;
    default:
      color = "light";
  }
  return <span className={`badge bg-${color} rounded-pill`}>{sub}</span>;
};

const getKycBadge = (status) => {
  let color;
  switch (status) {
    case "Pending":
      color = "warning";
      break;
    case "Approved":
      color = "success";
      break;
    case "Rejected":
      color = "danger";
      break;
    default:
      color = "light";
  }
  return <span className={`badge bg-${color} rounded-pill`}>{status}</span>;
};

const getDaysLeftBadge = (days) => {
  let color = "success";
  if (days === 0) color = "danger";
  else if (days < 10) color = "warning";
  return <span className={`badge bg-${color} rounded-pill`}>{days} Days</span>;
};

const Clients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const {
  //   list: clients,
  //   loading,
  //   error,
  // } = useSelector((state) => state.payments);
  const { clients, loading, error } = useSelector((state) => state?.clients);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All Subscriptions");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // dispatch(fetchPayments());
    dispatch(fetchClients());
  }, [dispatch]);

  // Filter + Search

  const ITEMS_PER_PAGE = 6;

  const filteredClients = useMemo(() => {
    return clients.filter((trx) => {
      const searchMatch =
        trx.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trx.clientId?.toLowerCase().includes(searchTerm.toLowerCase());
      // const statusMatch = filterStatus === "All" || trx.status === filterStatus;
      return searchMatch;
    });
  }, [clients, searchTerm]);

  // --- Pagination
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
 
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };

  // if (loading) return <p className="text-center py-5">Loading clients...</p>;
  if (error)
    return (
      <p className="text-center text-danger py-5">
        Failed to load clients: {error}
      </p>
    );

  return (
    <div className="crm-container">
      {/* Top Section */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 p-3 bg-white shadow-sm rounded-3 border-start border-4 border-primary crm-header-card">
        <h2 className="mb-0 fs-4 text-dark-emphasis">Clients Management</h2>

        <div className="d-flex align-items-center flex-grow-1 flex-md-grow-0 ms-md-5 mt-2 mt-md-0">
          <div
            className="input-group input-group-sm me-3"
            style={{ maxWidth: "300px" }}
          >
            <span className="input-group-text bg-white border-end-0 text-muted">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by name or clientId"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset page on search
              }}
            />
          </div>
        </div>

        <p className="mb-0 ms-auto text-muted small mt-2 mt-md-0">
          Showing{" "}
          <strong className="text-dark">{paginatedClients.length}</strong> of{" "}
          <strong className="text-dark">{filteredClients.length}</strong>{" "}
          filtered results
        </p>
      </div>

      {/* Table */}
      <Card className=" shadow-sm rounded-3 border-0">
        <Card.Body className=" p-0">
          <div className="table-responsive">
            <Table className="table table-striped table-hover align-middle mb-0 crm-table">
              <thead className="table-light">
                <tr>
                  <th>#ID</th>
                  <th>Client Name</th>
                  <th>Email</th>
                  <th className="d-none d-lg-table-cell">Contact No</th>
                  {/* <th className="d-none d-xl-table-cell">WhatsApp</th> */}
                  <th className="d-none d-xl-table-cell">PAN</th>
                  <th>Subscription</th>
                  <th className="d-none d-md-table-cell">
                    Expiry Date
                  </th>
                  <th>Days Left</th>
                  <th className="d-none d-md-table-cell">Plan</th>
                  <th className="d-none d-md-table-cell">GST No.</th>
                  <th>KYC Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map((client) => (
                  <tr key={client._id}>
                    <td className="fw-bold text-primary small">
                      #{client.clientId}
                    </td>
                    <td>{client.name}</td>
                    <td>
                      <span className="small text-muted">{client.email}</span>
                    </td>
                    <td className="d-none d-lg-table-cell">{client.phone}</td>
                    {/* <td className="d-none d-xl-table-cell">{client.phone}</td> */}
                    <td className="d-none d-xl-table-cell small text-muted">
                      {/* <span className="d-block text-nowrap">
                        Aadhaar: {client.pan}
                      </span> */}
                      <span className="d-block text-nowrap">{client.pan}</span>
                    </td>
                    <td>{getSubscriptionBadge(client.subscription)}</td>
                    {/* <td className="small text-muted d-none d-md-table-cell text-nowrap">
                      {(() => {
                        const from = new Date(client.createdAt);
                        const to = new Date(from);
                        to.setDate(to.getDate() + client.duration);
                        return `${from.toLocaleDateString(
                          "en-GB"
                        )} - ${to.toLocaleDateString("en-GB")}`;
                      })()}
                    </td> */}
                    {/* <td className="small text-muted d-none d-md-table-cell text-nowrap">
  {client.subscriptionEndDate
    ? `${new Date(client.createdAt).toLocaleDateString("en-GB")} - ${new Date(
        client.subscriptionEndDate
      ).toLocaleDateString("en-GB")}`
    : "—"}
</td> */}
<td className="small text-muted d-none d-md-table-cell text-nowrap">
  {client.subscriptionEndDate
    ? new Date(client.subscriptionEndDate).toLocaleDateString("en-GB")
    : "—"}
</td>


                    <td>{getDaysLeftBadge(client.daysLeft)}</td>
                    <td className="d-none d-md-table-cell small text-nowrap">
                      {client.planType}
                    </td>
                    <td className="d-none d-md-table-cell small text-nowrap">
                      {client.clientGST}
                    </td>
                    <td
                      // onClick={async () => {
                      //   const newStatus =
                      //     client.kyc === "Approved" ? "Pending" : "Approved";

                      //   await dispatch(
                      //     updateKycStatus({
                      //       clientId: client.clientId,
                      //       kyc: newStatus,
                      //     })
                      //   );
                      // }}
                      // style={{ cursor: "pointer" }}
                      title="Click to update KYC status"
                    >
                      {getKycBadge(client.kyc)}
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center">
                        <button
                          className="btn btn-outline-info btn-sm crm-action-btn me-2"
                          title="View Details"
                          onClick={() =>
                            navigate(`/admin/clientsDetails/${client.clientId}`)
                          }
                        >
                          <Eye size={16} />
                        </button>
                        {/* <button
                          className="btn btn-outline-primary btn-sm crm-action-btn me-2"
                          title="Edit Client"
                        >
                          <Edit size={16} />
                        </button> */}
                        {/* <button
                          className="btn btn-outline-secondary btn-sm crm-action-btn me-2 d-none d-sm-block"
                          title="Generate Invoice"
                        >
                          <FileText size={16} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

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
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Clients;

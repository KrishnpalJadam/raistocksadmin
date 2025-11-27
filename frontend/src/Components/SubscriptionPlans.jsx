import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, ListGroup } from "react-bootstrap";
import {
  Check,
  Clock,
  TrendingUp,
  DollarSign,
  Users,
  RefreshCw,
  Edit,
  Trash2,
} from "lucide-react";
import SwitchPlanModal from "./SwitchPlanModal";
import PlanClientsModal from "./PlanClientsModal";
import AddSubscriptionModal from "./AddSubscriptionModal";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlansAsync,
  deleteSubscriptionAsync,
} from "../slices/subscriptionSlice";

// const planTiers = [
//   {
//     name: "Trial",
//     badge: "bg-secondary",
//     description: "Standard limited access.",
//     features: [
//       // --- Features ---
//       "1 – 4 actionable ideas every market day*",
//       "Scalp Trades – Quickfire momentum opportunities",
//       "Intraday Trades – Precision-based daily setups",
//       "Swing Trades – Hold for days/weeks with defined risk levels",
//       "Investment Ideas – Long-term fundamental picks",
//       "Strategic Positions – Based on macro & sentiment analysis",
//       "Income-Generating Ideas – Designed for passive returns",
//     ],
//     services: [
//       // --- Services ---
//       "Delivered via WhatsApp for faster execution",
//       "Personal Dashboard access",
//       "Real-time tracking of all active and closed trades",
//       "Performance reports and allocation summaries",
//       "Personalized Trade Diary to record and review each idea",
//       "All trades are trackable ensuring full transparency and control",
//       "End-of-trial performance report",
//     ],
//   },
//   {
//     name: "Extended Trial",
//     badge: "bg-info",
//     description: "Extended limited access for evaluation.",
//     features: [
//       "15 Days Duration",
//       "Basic RAI Access (Limited)",
//       "Email Support Only",
//       "Free (Admin Approved)",
//     ],
//   },
//   {
//     name: "Investor",
//     badge: "bg-primary",
//     description: "Designed for long-term investors.",
//     options: [
//       { period: "Monthly", price: "₹10,000" },
//       { period: "Quarterly", price: "₹25,000" },
//       { period: "Yearly", price: "₹90,000" },
//     ],
//     features: [
//       "1-4* actionable ideas every market week",
//       "Swing Trades – Hold for weeks to months with precise entry/exit logic",
//       "Investment Ideas – Long-term picks with strong fundamentals",
//       "F&O for portfolio hedging (Minimum 8 calls per month)",
//     ],
//     services: [
//       "Delivered via WhatsApp for faster execution",
//       "Personal Dashboard",
//       "Real-time tracking of all active and closed trades",
//       "Access to performance reports and allocation summaries",
//       "A personalized Trade Diary to record and review each idea",
//       "All your trades are trackable, ensuring full transparency and control",
//       "Monthly performance report",
//     ],
//   },
//   {
//     name: "Trader",
//     badge: "bg-success",
//     description: "Optimized for active daily traders.",
//     options: [
//       { period: "Monthly", price: "₹12,000" },
//       { period: "Quarterly", price: "₹30,000" },
//       { period: "Yearly", price: "₹110,000" },
//     ],
//     features: [
//       "1 – 4 actionable ideas every market day*",
//       "Scalp Trades – Quickfire momentum opportunities",
//       "Intraday Trades – Precision-based daily setups",
//       "Swing Trades – Hold for days/weeks with defined risk levels",
//       "Investment Ideas – Long-term fundamental picks",
//       "Strategic Positions – Based on macro & sentiment analysis",
//       "Income-Generating Ideas – Designed for passive returns (Minimum 24 calls per month)",
//     ],
//     services: [
//       "Delivered via WhatsApp for faster execution",
//       "Personal Dashboard",
//       "Real-time tracking of all active and closed trades",
//       "Real-time tracking of all active and closed trades",
//       "A personalized Trade Diary to record and review each idea",
//       "All your trades are trackable, ensuring full transparency and control",
//       "Monthly performance report",
//     ],
//   },
// ];

const SubscriptionPlans = () => {
  const dispatch = useDispatch();
  const { plans, status } = useSelector((state) => state.subscriptions);
  console.log("Fetched Plans:", plans);

  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [planToEdit, setPlanToEdit] = useState(null);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [modalShow, setModalShow] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [clientsData, setClientsData] = useState([
    // Example client data
    {
      name: "John Doe",
      email: "john@example.com",
      contact: "9876543210",
      plan: "Trader",
      startDate: "2025-10-01",
      expiryDate: "2025-11-01",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      contact: "9123456780",
      plan: "Investor",
      startDate: "2025-09-15",
      expiryDate: "2026-09-15",
    },
  ]);

  useEffect(() => {
    dispatch(fetchPlansAsync());
  }, [dispatch]);

  // Add this function
  const getBadgeClass = (planName) => {
    switch (planName) {
      case "Trial":
        return "bg-secondary";
      case "Custom":
        return "bg-secondary";
      case "Extended Trial":
        return "bg-info";
      case "Investor":
        return "bg-primary";
      case "Trader":
        return "bg-success";
      case "Trader Premium":
        return "bg-success";
      default:
        return "bg-light text-dark";
    }
  };

  // Determine card variant based on plan type
  const getCardVariant = (planName) => {
    if (planName === "Trial") return "border-secondary";
    if (planName === "Investor") return "border-primary";
    if (planName === "Trader") return "border-success";
    return "border-light";
  };

  const handleEditClick = (plan) => {
    setPlanToEdit(plan);
    setEditMode(true);
    setAddModal(true);
  };

  return (
    <div className="page-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">📑 Subscription Plans Management</h2>
        <Button
          variant="success"
          onClick={() => {
            setAddModal(true);
            setEditMode(false);
          }}
        >
          <Users className="lucide-icon me-2" /> Add Subscription
        </Button>
      </div>
      {status === "loading" && <p>Loading plans...</p>}
      <Row>
        {plans.map((plan, index) => (
          <Col lg={3} md={6} sm={12} className="mb-4" key={index}>
            <Card
              className={`h-100 shadow-sm ${getCardVariant(plan.planName)}`}
            >
              <Card.Header
                className={`text-white p-3 ${getBadgeClass(plan.planName)}`}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{plan.planName}</h5>
                  <div className="d-flex">
                    {/* Edit Icon */}
                    <Button
                      variant="outline-light"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditClick(plan)}
                    >
                      <Edit size={16} />
                    </Button>
                    {/* Delete Icon */}
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => {
                        dispatch(deleteSubscriptionAsync(plan._id));
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="d-flex flex-column">
                <p className="text-muted small mb-3">{plan.description}</p>

                {plan.pricingOptions?.length > 0 ? (
                  <>
                    <h6 className="text-primary mb-2">Pricing Options:</h6>
                    <ListGroup variant="flush" className="mb-3">
                      {plan.pricingOptions.map((option, idx) => (
                        <ListGroup.Item
                          key={idx}
                          className="d-flex justify-content-between p-2"
                        >
                          <span>{option.type}</span>
                          <strong className="text-success">
                            ₹{option.price}
                          </strong>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </>
                ) : (
                  <h3 className="mb-4">
                    <DollarSign className="lucide-icon me-1 text-success" />{" "}
                    Free
                  </h3>
                )}

                <h6 className="text-secondary mb-2">Features:</h6>
                <ListGroup variant="flush" className="flex-grow-1 mb-2">
                  {plan.pricingOptions?.map((option, idx) =>
                    option.features?.map((feature, fIdx) => (
                      <ListGroup.Item
                        key={`${idx}-${fIdx}`}
                        className="d-flex align-items-start p-2 border-0"
                      >
                        <Check
                          size={18}
                          className="text-success me-2 flex-shrink-0"
                        />
                        <span className="small">{feature}</span>
                      </ListGroup.Item>
                    ))
                  )}
                </ListGroup>

                {/* <h6 className="text-secondary mb-2">Services:</h6>
                <ListGroup variant="flush">
                  {plan.pricingOptions?.map((option, idx) =>
                    option.services?.map((service, sIdx) => (
                      <React.Fragment key={`${idx}-${sIdx}`}>
                        <ListGroup.Item className="d-flex align-items-start p-2 border-0">
                          <Check
                            size={18}
                            className="text-success me-2 flex-shrink-0"
                          />
                          <span className="small">{service.serviceName}</span>
                        </ListGroup.Item>

                        {service.subServices?.map((sub, subIdx) => (
                          <ListGroup.Item
                            key={`${idx}-${sIdx}-${subIdx}`}
                            className="d-flex align-items-start ps-5 py-1 border-0"
                          >
                            <Check
                              size={16}
                              className="text-info me-2 flex-shrink-0"
                            />
                            <span className="small">{sub.name}</span>
                          </ListGroup.Item>
                        ))}
                      </React.Fragment>
                    ))
                  )}
                </ListGroup> */}
                {plan.pricingOptions?.some(
                  (option) => option.services?.length > 0
                ) && (
                    <>
                      <h6 className="text-secondary mb-2">Services:</h6>
                      <ListGroup variant="flush">
                        {plan.pricingOptions.map((option, idx) =>
                          option.services?.map((service, sIdx) => (
                            <React.Fragment key={`${idx}-${sIdx}`}>
                              <ListGroup.Item className="d-flex align-items-start p-2 border-0">
                                <Check
                                  size={18}
                                  className="text-success me-2 flex-shrink-0"
                                />
                                <span className="small">
                                  {service.serviceName}
                                </span>
                              </ListGroup.Item>

                              {service.subServices?.map((sub, subIdx) => (
                                <ListGroup.Item
                                  key={`${idx}-${sIdx}-${subIdx}`}
                                  className="d-flex align-items-start ps-5 py-1 border-0"
                                >
                                  <Check
                                    size={16}
                                    className="text-info me-2 flex-shrink-0"
                                  />
                                  <span className="small">{sub.name}</span>
                                </ListGroup.Item>
                              ))}
                            </React.Fragment>
                          ))
                        )}
                      </ListGroup>
                    </>
                  )}
              </Card.Body>
              {plan.planName === "Custom" && (
                <Card.Footer className="bg-white border-top text-center">
                  <a
                    href={`https://www.dashboard.raistocks.com/raisctocksCustomPlan/${plan._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    https://www.dashboard.raistocks.com/raisctocksCustomPlan/{plan._id}
                  </a>
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <AddSubscriptionModal
        show={addModal}
        handleClose={() => setAddModal(false)}
        mode={editMode ? "edit" : "add"}
        planData={planToEdit}
      />

      <PlanClientsModal
        show={modalShow}
        handleClose={() => setModalShow(false)}
        planName={selectedPlan}
        clients={clientsData.filter((c) => c.plan === selectedPlan)}
      />
      {/* Admin Switch Plan Modal */}
      <SwitchPlanModal show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default SubscriptionPlans;

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Form,
  Row,
  Col,
  Pagination,
  Modal,
} from "react-bootstrap";
import { Search, Edit, Plus, Target, Eye, Trash2, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrades, createTrade, deleteTrade } from "../slices/tradeSlice";
import { createTradeAction } from "../slices/tradeActionsSlice";

const RAIData = () => {
  const dispatch = useDispatch();
  const { items: trades = [], status: tradesStatus = "idle" } = useSelector(
    (s) => s.trades || {}
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  // trade action form state (used inside Update modal)
  const [actionType, setActionType] = useState("update");
  const [actionPrice, setActionPrice] = useState("");
  const [actionTitle, setActionTitle] = useState("");
  const [actionComment, setActionComment] = useState("");
  const [AddshowModal, AddsetShowModal] = useState(false);

  const emptyForm = {
    segment: "Cash",
    tradeType: "Intraday",
    action: "Buy",
    on: "",
    entryPrice: "",
    stoploss: "",
    target1: "",
    target2: "",
    target3: "",
    timeDuration: "Today",
    weightageValue: 0,
    weightageExtension: "% of your capital",
    lotSize: "",
    lots: 1,
    recommendationDateTime: "",
    status: "Pending",
  };
  const [form, setForm] = useState(emptyForm);

  const ITEMS_PER_PAGE = 10;

  const filteredTrades = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();
    return trades.filter((trade) => {
      if (!trade) return false;
      const title = trade.title
        ? String(trade.title)
        : `${trade.action || ""} ${trade.on || ""}`;
      return (
        title.toLowerCase().includes(q) ||
        String(trade.on || "")
          .toLowerCase()
          .includes(q) ||
        String(trade.segment || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [searchTerm, trades]);

  const totalPages = Math.ceil(filteredTrades.length / ITEMS_PER_PAGE);
  const paginatedTrades = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTrades.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTrades, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getBadgeClass = (result) => {
    if (result === "Profit") return "text-success fw-bold";
    if (result === "Loss") return "text-danger fw-bold";
    return "text-primary";
  };

  const handleView = (trade) => {
    setSelectedTrade(trade);
    setShowModal(true);
  };
  // Open update modal for a specific trade
  const handleUpdate = (trade) => {
    setSelectedTrade(trade);
    setUpdateModal(true);
  };

  // submit handler for trade action (Update / Book Profit / Stoploss Hit)
  const handleActionSubmit = (e) => {
    e.preventDefault();

    // selectedTrade must be set by clicking Update on a row or via View -> Update
    const trade = selectedTrade;
    if (!trade) {
      return alert(
        "No trade selected to apply action. Click Update on a trade row first."
      );
    }

    const payload = {
      tradeId: trade._id || trade.id,
      type: actionType || "update",
      title: actionTitle || actionType || "update",
      price: Number(actionPrice) || 0,
      comment: actionComment || "",
    };

    dispatch(
      createTradeAction({ tradeId: payload.tradeId, actionData: payload })
    )
      .unwrap()
      .then(() => {
        alert("Action created");
        // reset local action form and close modal
        setActionPrice("");
        setActionTitle("");
        setActionComment("");
        setActionType("update");
        setUpdateModal(false);
      })
      .catch((err) => {
        alert("Failed to create action: " + (err?.message || err));
      });
  };
  const AddhandleView = (trade) => {
    AddsetShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this trade?")) {
      dispatch(deleteTrade(id));
    }
  };

  useEffect(() => {
    if (tradesStatus === "idle") dispatch(fetchTrades());
  }, [dispatch, tradesStatus]);

  const handleFormChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleAddTradeSubmit = (e) => {
    e.preventDefault();
    // normalize payload to backend schema
    const payload = {
      segment: form.segment,
      tradeType: form.tradeType,
      action: form.action,
      on: form.on,
      entryPrice: Number(form.entryPrice) || 0,
      stoploss: form.stoploss || "NA",
      target1: form.target1 ? Number(form.target1) : undefined,
      target2: form.target2 ? Number(form.target2) : undefined,
      target3: form.target3 ? Number(form.target3) : undefined,
      timeDuration: form.timeDuration,
      weightageValue: Number(form.weightageValue) || 0,
      weightageExtension: form.weightageExtension,
      lotSize: form.lotSize,
      lots: Number(form.lots) || 1,
      recommendationDateTime: form.recommendationDateTime || undefined,
      status: form.status || "Pending",
    };
    dispatch(createTrade(payload))
      .unwrap()
      .then(() => {
        alert("Trade added");
        AddsetShowModal(false);
        setForm(emptyForm);
      })
      .catch((err) => alert("Failed to add trade: " + (err?.message || err)));
  };

  return (
    <div className="page-content">
      <Modal
        show={AddshowModal}
        onHide={() => AddsetShowModal(false)}
        size="lg"
        centered
        className="trade-view-modal"
      >
        <Modal.Header
          closeButton
          className="bg-primary bg-opacity-10 border-bottom"
        >
          <Modal.Title className="fw-bold text-primary">
            <Plus className="me-2 text-success" /> Add New Trade
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Card.Body>
            <Form onSubmit={handleAddTradeSubmit}>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Segment</Form.Label>
                    <Form.Select
                      value={form.segment}
                      onChange={(e) =>
                        handleFormChange("segment", e.target.value)
                      }
                    >
                      <option>Cash</option>
                      <option>Index future</option>
                      <option>Index option</option>
                      <option>Commodity future</option>
                      <option>Commodity option</option>
                      <option>Stock future</option>
                      <option>Stock option</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Trade Type</Form.Label>
                    <Form.Select
                      value={form.tradeType}
                      onChange={(e) =>
                        handleFormChange("tradeType", e.target.value)
                      }
                    >
                      <option>Swing</option>
                      <option>Intraday</option>
                      <option>Scalp</option>
                      <option>Invest</option>
                      <option>Strategy</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Action</Form.Label>
                    <Form.Select
                      value={form.action}
                      onChange={(e) =>
                        handleFormChange("action", e.target.value)
                      }
                    >
                      <option>Buy</option>
                      <option>Sell</option>
                      <option>Long</option>
                      <option>Short</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>On</Form.Label>
                    <Form.Control
                      value={form.on}
                      onChange={(e) => handleFormChange("on", e.target.value)}
                      type="text"
                      placeholder="Banknifty / Reliance etc."
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Entry Price</Form.Label>
                    <Form.Control
                      value={form.entryPrice}
                      onChange={(e) =>
                        handleFormChange("entryPrice", e.target.value)
                      }
                      type="number"
                      placeholder="277"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Stoploss</Form.Label>
                    <Form.Control
                      value={form.stoploss}
                      onChange={(e) =>
                        handleFormChange("stoploss", e.target.value)
                      }
                      type="text"
                      placeholder="207 or NA"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Target 1</Form.Label>
                    <Form.Control
                      value={form.target1}
                      onChange={(e) =>
                        handleFormChange("target1", e.target.value)
                      }
                      type="number"
                      placeholder="344"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Target 2</Form.Label>
                    <Form.Control
                      value={form.target2}
                      onChange={(e) =>
                        handleFormChange("target2", e.target.value)
                      }
                      type="number"
                      placeholder="384"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Target 3</Form.Label>
                    <Form.Control
                      value={form.target3}
                      onChange={(e) =>
                        handleFormChange("target3", e.target.value)
                      }
                      type="number"
                      placeholder="436"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Time Duration</Form.Label>
                    <Form.Select
                      value={form.timeDuration}
                      onChange={(e) =>
                        handleFormChange("timeDuration", e.target.value)
                      }
                    >
                      <option>Today</option>
                      <option>Tomorrow</option>
                      <option>15 Days</option>
                      <option>1 to 2 Months</option>
                      <option>1 to 3 Months</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Weightage Value</Form.Label>
                    <Form.Control
                      value={form.weightageValue}
                      onChange={(e) =>
                        handleFormChange("weightageValue", e.target.value)
                      }
                      type="number"
                      placeholder="6"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Weightage Extension</Form.Label>
                    <Form.Select
                      value={form.weightageExtension}
                      onChange={(e) =>
                        handleFormChange("weightageExtension", e.target.value)
                      }
                    >
                      <option>% of your capital</option>
                      <option>% of your capital or minimum 1 lot</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Lot Size</Form.Label>
                    <Form.Control
                      value={form.lotSize}
                      onChange={(e) =>
                        handleFormChange("lotSize", e.target.value)
                      }
                      type="text"
                      placeholder="Optional"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Lots</Form.Label>
                    <Form.Control
                      value={form.lots}
                      onChange={(e) => handleFormChange("lots", e.target.value)}
                      type="number"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Recommendation Date & Time</Form.Label>
                    <Form.Control
                      value={form.recommendationDateTime}
                      onChange={(e) =>
                        handleFormChange(
                          "recommendationDateTime",
                          e.target.value
                        )
                      }
                      type="datetime-local"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={form.status}
                      onChange={(e) =>
                        handleFormChange("status", e.target.value)
                      }
                    >
                      <option>Pending</option>
                      <option>Live</option>
                      <option>Closed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <div className="mt-4 text-end">
                <Button type="submit" variant="success">
                  {" "}
                  Add Trade{" "}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Modal.Body>
        <Modal.Footer className="bg-light border-top">
          <Button
            variant="outline-secondary"
            className="px-4"
            onClick={() => AddsetShowModal(false)}
          >
            {" "}
            Close{" "}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* --- Trade Table --- */}
      <Card className="shadow-sm">
        <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <Target className="text-primary me-2" />
            All Trades Log
          </h5>
          <Form className="d-flex align-items-center">
            <Search className="me-2 text-secondary" />
            <Form.Control
              type="text"
              placeholder="Search trade title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form>
          <button className="btn btn-primary" onClick={AddhandleView}>
            + Add Trade
          </button>
        </Card.Header>

        <Card.Body>
          <Table responsive hover className="align-middle text-nowrap">
            <thead>
              <tr>
                <th>#</th>

                <th>Segment</th>
                <th>Type</th>
                <th>Action</th>
                <th>On</th>
                <th>Entry</th>

                <th>Status</th>
                <th>Result</th>
                <th>PnL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTrades.length > 0 ? (
                paginatedTrades.map((t, idx) => (
                  <tr key={t._id || t.id}>
                    <td>{startIndex + idx + 1}</td>

                    <td>{t.segment}</td>
                    <td>{t.tradeType}</td>
                    <td>{t.action}</td>
                    <td>{t.on}</td>
                    <td>₹{t.entryPrice ?? t.entry}</td>

                    <td>
                      <span
                        className={`badge bg-${
                          t.status === "Live" ? "info" : "secondary"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className={getBadgeClass(t.result)}>
                      {t.result || "-"}
                    </td>
                    <td>
                      {t.pnl
                        ? t.pnl > 0
                          ? `+₹${t.pnl}`
                          : `-₹${Math.abs(t.pnl)}`
                        : "-"}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          className="btn-sm"
                          onClick={() => handleUpdate(t)}
                        >
                          Update
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleView(t)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(t._id || t.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="17" className="text-center text-muted py-4">
                    No trades found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination>
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={currentPage === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
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
      {/* --- update Modal --- */}
      <Modal
        show={updateModal}
        onHide={() => setUpdateModal(false)}
        size="lg"
        centered
        className="trade-view-modal"
      >
        <Modal.Header
          closeButton
          className="bg-primary bg-opacity-10 border-bottom"
        >
          <Modal.Title className="fw-bold text-primary">
            Update Trade
          </Modal.Title>
        </Modal.Header>

        {/* TRADE ACTIONS */}
        <Modal.Body className="p-4">
          {/* Here will be update the from here there are tradeActions -- update , book_info , stoploss_hit */}
          <form onSubmit={handleActionSubmit}>
            {/* Title / Action Type Field */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Action</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="form-select"
              >
                <option value="update">Update</option>
                <option value="book_profit">Book Profit</option>
                <option value="stoploss_hit">Stoploss Hit</option>
                <option value="exit">Exit</option>
              </select>
            </div>

            {/* Title Field (optional override) */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Optional title (defaults to action)"
                value={actionTitle}
                onChange={(e) => setActionTitle(e.target.value)}
              />
            </div>

            {/* Price Field */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Price</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter trade price"
                min="0"
                step="any"
                value={actionPrice}
                onChange={(e) => setActionPrice(e.target.value)}
              />
            </div>

            {/* Comment Field */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Comment</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Write your comment here..."
                value={actionComment}
                onChange={(e) => setActionComment(e.target.value)}
              ></textarea>
            </div>

            {/* Translation Field */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Trade SL Hit</label>
              <input type="text" className="form-control" placeholder="Enter" />
            </div>

            {/* this is where we will submit our actions.. */}
            {/* Update Button */}
            <div className="text-end">
              <Button variant="primary" type="submit" className="px-4">
                Update
              </Button>
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer className="bg-light border-top">
          <Button
            variant="outline-secondary"
            className="px-4"
            onClick={() => setUpdateModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* --- View Modal --- */}{" "}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        className="trade-view-modal"
      >
        {" "}
        <Modal.Header
          closeButton
          className="bg-primary bg-opacity-10 border-bottom"
        >
          {" "}
          <Modal.Title className="fw-bold text-primary">
            {" "}
            <Eye className="me-2 text-primary" size={18} /> Trade Details{" "}
          </Modal.Title>{" "}
        </Modal.Header>{" "}
        <Modal.Body className="p-4">
          {" "}
          {selectedTrade ? (
            <div className="table-responsive">
              {" "}
              <Table hover bordered className="align-middle">
                {" "}
                <tbody>
                  {" "}
                  {Object.entries(selectedTrade).map(([key, value]) => (
                    <tr key={key}>
                      {" "}
                      <td
                        style={{
                          width: "35%",
                          backgroundColor: "#f8f9fa",
                          fontWeight: "600",
                          textTransform: "capitalize",
                          color: "#495057",
                        }}
                      >
                        {" "}
                        {key.replace(/([A-Z])/g, " $1")}{" "}
                      </td>{" "}
                      <td style={{ color: "#212529", fontWeight: "500" }}>
                        {" "}
                        {Array.isArray(value)
                          ? value.join(", ")
                          : value
                          ? String(value)
                          : "-"}{" "}
                      </td>{" "}
                    </tr>
                  ))}{" "}
                </tbody>{" "}
              </Table>{" "}
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              No trade selected.
            </div>
          )}{" "}
        </Modal.Body>{" "}
        <Modal.Footer className="bg-light border-top">
          {" "}
          <Button
            variant="outline-secondary"
            className="px-4"
            onClick={() => setShowModal(false)}
          >
            {" "}
            Close{" "}
          </Button>{" "}
        </Modal.Footer>{" "}
      </Modal>
    </div>
  );
};

export default RAIData;

import React, { useEffect, useState } from "react";
import { Card, Form, Nav, Row, Col, Button } from "react-bootstrap";
import { Save, RefreshCw, Plus, Eye } from "lucide-react";
import TradeSatupView from "./TradeSatupView";
import { useDispatch, useSelector } from "react-redux";
import {

  fetchMarketInsights,
  createMarketInsight,
  updateMarketInsight,
  deleteMarketInsight,

} from "../slices/marketInsightSlice";


import {
  createMarketPhase,
  fetchMarketPhases,
} from "../slices/marketPhaseSlice";
import {
  createMarketTrend,
  fetchMarketTrends,
} from "../slices/marketTrendSlice";
import {
  createTradeStrategy,
  fetchTradeStrategies,

} from "../slices/tradeStrategySlice";

import { createVix } from "../slices/vixSlice";
import { createGlobalMarket } from "../slices/globalMarketSlice";
import MarketSetupForm from "./MarketSetupForm";
import MarketSetupViewTable from "./Marketsatupviewtable";

const TradeSatup = () => {
  const [activeModule, setActiveModule] = useState("marketInsight"); // marketInsight | marketPhase | marketTrend
  const [activeTab, setActiveTab] = useState("add"); // add | view
  const dispatch = useDispatch();
  const { items: insights = [], status = "idle" } = useSelector(
    (s) => s.marketInsights || {}
  );
  const { items: strategies = [], status: strategyStatus } = useSelector(
    (s) => s.tradeStrategies || {}
  );
  const [tradeStrategy, setTradeStrategy] = useState({
    date: "",
    title: "",
    comment: "",
  });

  useEffect(() => {
    if (strategyStatus === "idle") dispatch(fetchTradeStrategies());
  }, [dispatch, strategyStatus]);


  const handleSaveTradeStrategy = () => {
    if (!tradeStrategy.title || !tradeStrategy.comment) {
      alert("Please fill all fields");
      return;
    }
   const payload = {
  title: tradeStrategy.title,
  description: tradeStrategy.comment,
  date: tradeStrategy.date,
};
dispatch(createTradeStrategy(payload))
  .unwrap()
  .then(() => {
    alert("Trade Strategy saved successfully");
    setTradeStrategy({ date: "", title: "", comment: "" });
    dispatch(fetchTradeStrategies());
  })
  .catch((err) => alert("Failed: " + err));

      
  };


  const empty = {
    // Market Insight core fields
    marketInfo: "",
    title: "",
    comment: "",
    sentiment: null,
    date: new Date().toISOString().slice(0, 10),
    // Global Market fields (optional)
    country: "",
    currency: 0,
    value: "",
    globalcomment: "",
    // VIX field (optional)
    vixValue: "",
  };

  const handleInlineCreate = () => {
    // Decide which module to create based on activeModule
    if (activeModule === "marketInsight") {
      const payload = { ...marketInsight };
      if (!payload.sentiment) payload.sentiment = null;
      dispatch(createMarketInsight(payload))
        .unwrap()
        .then(() => {
          alert("Market Insight created successfully");
          setMarketInsight(empty);
        })
        .catch((err) =>
          alert("Failed to create Market Insight: " + (err?.message || err))
        );
    } else if (activeModule === "marketPhase") {
      // reuse inline phase creator
      handleCreateMarketPhaseInline();
    } else if (activeModule === "marketTrend") {
      const t = {
        title: marketInsight.title || "",
        description: marketInsight.comment || "",
        date: marketInsight.date,
      };
      dispatch(createMarketTrend(t))
        .unwrap()
        .then(() => {
          alert("Market Trend created successfully");
          setMarketInsight((prev) => ({ ...prev, title: "", comment: "" }));
          dispatch(fetchMarketTrends());
          setActiveTab("view");
        })
        .catch((err) =>
          alert("Failed to create Market Trend: " + (err?.message || err))
        );
    }
  };

  const [marketInsight, setMarketInsight] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (status === "idle") dispatch(fetchMarketInsights());
  }, [dispatch, status]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (activeModule === "marketInsight") {
      // Combine all data into one payload
      const payload = {
        marketInfo: marketInsight.marketInfo || "",
        title: marketInsight.title || "",
        comment: marketInsight.comment || "",
        sentiment: marketInsight.sentiment || null, // null means Neutral
        date: marketInsight.date || new Date().toISOString(),
        country: marketInsight.country || "",
        currency: marketInsight.currency || 0,
        value: marketInsight.value || "",
        globalcomment: marketInsight.globalcomment || "",
        vixValue: marketInsight.vixValue || "",
      };

      if (editingId) {
        dispatch(updateMarketInsight({ id: editingId, data: payload }))
          .unwrap()
          .then(() => {
            alert("Market Insight updated successfully");
            setMarketInsight(empty);
            setEditingId(null);
          })
          .catch((err) =>
            alert("Failed to update Market Insight: " + (err?.message || err))
          );
      } else {
        dispatch(createMarketInsight(payload))
          .unwrap()
          .then(() => {
            alert("Market Insight created successfully");
            setMarketInsight(empty);
          })
          .catch((err) =>
            alert("Failed to create Market Insight: " + (err?.message || err))
          );
      }
    } else if (activeModule === "marketPhase") {
      const p = {
        title: marketInsight.title || "",
        description: marketInsight.comment || "",
        date: marketInsight.date,
      };
      dispatch(createMarketPhase(p));
      setMarketInsight(empty);
    } else if (activeModule === "marketTrend") {
      const t = {
        title: marketInsight.title || "",
        description: marketInsight.comment || "",
        date: marketInsight.date,
      };
      dispatch(createMarketTrend(t));
      setMarketInsight(empty);
    }
    setEditingId(null);
  };

  const handleCreateVix = () => {
    // Now just updates the form state - actual save happens with main form
    if (!marketInsight.vixValue) return alert("Enter VIX value");
    // VIX value will be included in main form submission
    alert("VIX value added - click Create/Update to save all changes");
  };

  const handleCreateMarketPhaseInline = () => {
    // create market phase using title, comment -> description, date
    const p = {
      title: marketInsight.title || "",
      description: marketInsight.comment || "",
      date: marketInsight.date,
    };
    dispatch(createMarketPhase(p))
      .unwrap()
      .then(() => {
        // refresh phase list so TradeSatupView (view tab) shows the newly created phase
        dispatch(fetchMarketPhases());
        alert("Market Phase created successfully");
        setMarketInsight((prev) => ({ ...prev, title: "", comment: "" }));
        // switch to view tab so user sees it (optional)
        setActiveTab("view");
      })
      .catch((err) =>
        alert("Failed to create Market Phase: " + (err?.message || err))
      );
  };

  const handleCreateGlobalMarket = () => {
    // Now just validates the data - actual save happens with main form
    if (!marketInsight.country || !marketInsight.currency) {
      return alert("Please select country and currency");
    }
    // Global market data will be included in main form submission
    alert("Global market data added - click Create/Update to save all changes");
  };

  const handleEdit = (item) => {
    const copy = { ...item };
    if (copy.date) copy.date = new Date(copy.date).toISOString().slice(0, 10);
    // normalize any existing 'Neutral' sentiment to null (we store null when no sentiment)
    if (copy.sentiment === "Neutral") copy.sentiment = null;
    setMarketInsight(copy);
    setEditingId(item._id);
    setActiveTab("add");
    setActiveModule("marketInsight");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this market insight?"))
      dispatch(deleteMarketInsight(id));
  };

  const handleSavePhase = () => {
    const payload = {
      title: marketInsight.title || "",
      description: marketInsight.comment || "",
      date: marketInsight.date,
    };
    dispatch(createMarketPhase(payload))
      .unwrap()
      .then(() => {
        dispatch(fetchMarketPhases());
        alert("Market Phase created successfully");
        setMarketInsight((prev) => ({ ...prev, title: "", comment: "" }));
        setActiveTab("view");
      })
      .catch((err) =>
        alert("Failed to create Market Phase: " + (err?.message || err))
      );
  };

  const handleSaveTrend = () => {
    const payload = {
      title: marketInsight.title || "",
      description: marketInsight.comment || "",
      date: marketInsight.date,
    };
    dispatch(createMarketTrend(payload))
      .unwrap()
      .then(() => {
        dispatch(fetchMarketTrends());
        alert("Market Trend created successfully");
        setMarketInsight((prev) => ({ ...prev, title: "", comment: "" }));
        setActiveTab("view");
      })
      .catch((err) =>
        alert("Failed to create Market Trend: " + (err?.message || err))
      );
  };

  return (
    <div className="trade-setup-admin">
      <Card className="mb-4 shadow-sm">
        <Card.Header className="d-flex align-items-center justify-content-between bg-white">
          <div>
            <h5 className="mb-0">Trade Setup — Admin</h5>
            <small className="text-muted">
              Choose a module to edit and fill fields below
            </small>
          </div>
        </Card.Header>
        {/* ---------- Nav Tabs ---------- */}
        <Card.Header className="bg-white border-bottom-0 pb-0">
          <Nav
            variant="tabs"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="border-bottom"
          >
            <Nav.Item>
              <Nav.Link eventKey="add" className="fw-semibold">
                <Plus size={14} className="me-1" /> Add Setup
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="view" className="fw-semibold text-dark">
                <Eye size={14} className="me-1" /> View Setup
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="marketSatupview"
                className="fw-semibold text-dark"
              >
                <Eye size={14} className="me-1" /> Market Setup View
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>

        <Card.Body>
          {activeTab === "add" && (
            <>
              <Form.Select
                className="mb-3"
                value={activeModule}
                onChange={(e) => setActiveModule(e.target.value)}
                aria-label="Select admin module"
                style={{ minWidth: 220 }}
              >
                <option value="marketInsight">Market Insight</option>
                <option value="marketPhase">Market Phase</option>
                <option value="marketTrend">Market Trend</option>
                <option value="marketSatup">Market Setup</option>
                <option value="tradeStrategy">Trade Strategy</option>
              </Form.Select>
              {/* ---------------- tradeStrategy ---------------- */}
              {activeModule === "tradeStrategy" && (
                <Form>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={tradeStrategy.date || ""}
                          onChange={(e) =>
                            setTradeStrategy((prev) => ({
                              ...prev,
                              date: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter title"
                          value={tradeStrategy.title || ""}
                          onChange={(e) =>
                            setTradeStrategy((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Enter your notes or summary..."
                          value={tradeStrategy.comment || ""}
                          onChange={(e) =>
                            setTradeStrategy((prev) => ({
                              ...prev,
                              comment: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="row mt-3">
                    <div className="col-sm-4">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSaveTradeStrategy}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </Form>
              )}

              {/* ---------------- Market Insight ---------------- */}
              {activeModule === "marketInsight" && (
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={12}>
                      <Card className="p-3 mb-3">
                        <h6 className="mb-2">Select</h6>
                        <Form.Select
                          className="mb-3"
                          aria-label="Select market info type"
                          style={{ minWidth: 220 }}
                          value={marketInsight.marketInfo || ""}
                          onChange={(e) =>
                            setMarketInsight((prev) => ({
                              ...prev,
                              marketInfo: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select type</option>
                          <option value="FII/DII data">FII/DII data</option>
                          <option value="MPC Meeting aka RBI Meeting">
                            MPC Meeting aka RBI Meeting
                          </option>
                          <option value="UD Federal Reserve Meeting">
                            UD Federal Reserve Meeting
                          </option>
                          <option value="GDP Data">GDP Data</option>
                          <option value="Inflation">Inflation</option>
                          <option value="Automobile Sales Data">
                            Automobile Sales Data
                          </option>
                          <option value="Dollar Rate">Dollar Rate</option>
                          <option value="Crude">Crude</option>
                          <option value="Gold">Gold</option>
                          <option value="Silver">Silver</option>
                          <option value="Government policy Announcement">
                            Government policy Announcement
                          </option>
                          <option value="Global Headline">
                            Global Headline
                          </option>
                          <option value="Stocks in News">Stocks in News</option>
                          <option value="About Market">About Market</option>
                          <option value="India VIX">India VIX</option>
                          <option value="Global Markets">Global Markets</option>

                        </Form.Select>

                        <Row className="g-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Date</Form.Label>
                              <Form.Control
                                type="date"
                                value={marketInsight.date || ""}
                                onChange={(e) =>
                                  setMarketInsight((prev) => ({
                                    ...prev,
                                    date: e.target.value,
                                  }))
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Title</Form.Label>
                              <Form.Control
                                type="text"
                                value={marketInsight.title || ""}
                                onChange={(e) =>
                                  setMarketInsight((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                  }))
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label>Comment</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                value={marketInsight.comment || ""}
                                onChange={(e) =>
                                  setMarketInsight((prev) => ({
                                    ...prev,
                                    comment: e.target.value,
                                  }))
                                }
                              />
                            </Form.Group>
                          </Col>

                          <Col md={12}>
                            <label className="form-label fw-semibold d-block">
                              Sentiment
                            </label>
                            <div className="d-flex align-items-center gap-4">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="sentiment"
                                  id="positive"
                                  checked={
                                    marketInsight.sentiment === "Positive"
                                  }
                                  onChange={() =>
                                    setMarketInsight((prev) => ({
                                      ...prev,
                                      sentiment: "Positive",
                                    }))
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="positive"
                                >
                                  Positive
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="sentiment"
                                  id="negative"
                                  checked={
                                    marketInsight.sentiment === "Negative"
                                  }
                                  onChange={() =>
                                    setMarketInsight((prev) => ({
                                      ...prev,
                                      sentiment: "Negative",
                                    }))
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="negative"
                                >
                                  Negative
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="sentiment"
                                  id="neutral"
                                  checked={marketInsight.sentiment === null}
                                  onChange={() =>
                                    setMarketInsight((prev) => ({
                                      ...prev,
                                      sentiment: null,
                                    }))
                                  }
                                />

                              </div>
                            </div>
                          </Col>
                        </Row>

                        <div>
                        </div>
                      </Card>
                    </Col>

                    {/* India VIX (fetchable) */}
                    {/* <Col md={6}>
                      <Card className="p-3 mb-3">
                        <h6 className="mb-2">India VIX (Previous Close)</h6>
                        <Row className="g-2">
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label>VIX Value</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="17.23"
                                value={marketInsight.vixValue || ""}
                                onChange={(e) =>
                                  setMarketInsight((prev) => ({
                                    ...prev,
                                    vixValue: e.target.value,
                                  }))
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3} className="d-flex align-items-end">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => {
                              }}
                            >
                              Fetch VIX
                            </Button>
                          </Col>
                        </Row>
                        <div className="row mt-3">
                          <div className="col-sm-4">
                            <button
                              className="btn btn-primary"
                              onClick={handleCreateVix}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </Card>
                    </Col> */}

                    {/* <Col md={6}>
                      <Card className="p-3 mb-3">
                        <h6 className="mb-2">Global Markets</h6>
                        <Row className="g-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Country</Form.Label>
                              <Form.Select
                                value={marketInsight.country || ""}
                                onChange={(e) =>
                                  setMarketInsight((prev) => ({
                                    ...prev,
                                    country: e.target.value,
                                  }))
                                }
                              >
                                <option value="">Select country</option>
                                <option value="London">London</option>
                                <option value="Japan">Japan</option>
                                <option value="US">US</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Currency</Form.Label>
                              <Form.Select
                                value={marketInsight.currency || 0}
                                onChange={(e) =>
                                  setMarketInsight((prev) => ({
                                    ...prev,
                                    currency: Number(e.target.value),
                                  }))
                                }
                              >
                                <option value={0}>Select currency</option>
                                <option value={1}>Pound</option>
                                <option value={2}>Yen</option>
                                <option value={3}>USD</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label>Value</Form.Label>
                              <Form.Control
                                type="text"
                                value={marketInsight.value || ""}
                                onChange={(e) =>
                                  setMarketInsight((prev) => ({
                                    ...prev,
                                    value: e.target.value,
                                  }))
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label>Global Market Comment</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={2}
                                value={marketInsight.globalcomment || ""}
                                onChange={(e) =>
                                  setMarketInsight((prev) => ({
                                    ...prev,
                                    globalcomment: e.target.value,
                                  }))
                                }
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card>
                    </Col> */}
                  </Row>

                  <Row className="mt-4">
                    <Col>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setMarketInsight(empty);
                          setEditingId(null);
                        }}
                      >
                        Reset Form
                      </Button>
                    </Col>
                    <Col className="text-end">
                      {editingId && (
                        <Button
                          variant="danger"
                          className="me-2"
                          onClick={() => handleDelete(editingId)}
                        >
                          Delete
                        </Button>
                      )}
                      <Button variant="success" type="submit">
                        <Save size={16} className="me-1" />
                        {editingId
                          ? "Update Market Insight"
                          : "Create Market Insight"}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}

              {/* ---------------- Market Phase ---------------- */}
              {activeModule === "marketPhase" && (
                <Form>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={marketInsight.date || ""}
                          onChange={(e) =>
                            setMarketInsight((prev) => ({
                              ...prev,
                              date: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Select
                          value={marketInsight.title || ""}
                          onChange={(e) =>
                            setMarketInsight((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select phase</option>
                          <option value="Accumulation">Accumulation</option>
                          <option value="Distribution">Distribution</option>
                          <option value="Greed">Greed</option>
                          <option value="Fear">Fear</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={marketInsight.comment || ""}
                          onChange={(e) =>
                            setMarketInsight((prev) => ({
                              ...prev,
                              comment: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>

                  </Row>
                  <div className="row mt-2">
                    <div className="col-sm-4">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSavePhase}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </Form>
              )}
              {/* Place Create VIX button inside VIX card area so it's clear it's for VIX only */}

              {/* ---------------- Market Trend ---------------- */}
              {activeModule === "marketTrend" && (
                <Form>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={marketInsight.date || ""}
                          onChange={(e) =>
                            setMarketInsight((prev) => ({
                              ...prev,
                              date: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Select
                          value={marketInsight.title || ""}
                          onChange={(e) =>
                            setMarketInsight((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select trend</option>
                          <option value="Bullish">Bullish</option>
                          <option value="Bearish">Bearish</option>
                          <option value="Sideways">Sideways</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={marketInsight.comment || ""}
                          onChange={(e) =>
                            setMarketInsight((prev) => ({
                              ...prev,
                              comment: e.target.value,
                            }))
                          }
                        />
                      </Form.Group>
                    </Col>

                  </Row>
                  <div className="row mt-2">
                    <div className="col-sm-4">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSaveTrend}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </Form>
              )}

              {/* market satup */}
              {activeModule === "marketSatup" && (
                <>
                  <MarketSetupForm />
                </>
              )}
            </>
          )}

          {activeTab === "view" && (
            <>
              <TradeSatupView />
            </>
          )}

          {activeTab === "marketSatupview" && (
            <>
              <MarketSetupViewTable />
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TradeSatup;
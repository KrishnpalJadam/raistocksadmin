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
import { createMarketPhase } from "../slices/marketPhaseSlice";
import { createMarketTrend } from "../slices/marketTrendSlice";
import MarketSetupForm from "./MarketSetupForm";

const TradeSatup = () => {
  const [activeModule, setActiveModule] = useState("marketInsight"); // marketInsight | marketPhase | marketTrend
  const [activeTab, setActiveTab] = useState("add"); // add | view
  const dispatch = useDispatch();
  const { items: insights = [], status = "idle" } = useSelector(
    (s) => s.marketInsights || {}
  );

  const empty = {
    marketInfo: "",
    title: "",
    comment: "",
    sentiment: null,
    country: "",
    currency: 0,
    value: "",
    globalcomment: "",
    vixValue: "",
    date: new Date().toISOString().slice(0, 10),
  };

  const [marketInsight, setMarketInsight] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (status === "idle") dispatch(fetchMarketInsights());
  }, [dispatch, status]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (activeModule === "marketInsight") {
      // ensure sentiment is null if not selected
      const payload = { ...marketInsight };
      if (!payload.sentiment) payload.sentiment = null;
      if (editingId)
        dispatch(updateMarketInsight({ id: editingId, data: payload }));
      else dispatch(createMarketInsight(payload));
    } else if (activeModule === "marketPhase") {
      // marketPhase expects { title, description, date }
      const p = {
        title: marketInsight.title || "",
        description: marketInsight.comment || "",
        date: marketInsight.date,
      };
      dispatch(createMarketPhase(p));
    } else if (activeModule === "marketTrend") {
      const t = {
        title: marketInsight.title || "",
        description: marketInsight.comment || "",
        date: marketInsight.date,
      };
      dispatch(createMarketTrend(t));
    }
    setMarketInsight(empty);
    setEditingId(null);
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
                <option value="marketSatup">Market Satup</option>
              </Form.Select>

              {/* ---------------- Market Insight ---------------- */}
              {activeModule === "marketInsight" && (
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={12}>
                      <Card className="p-3 mb-3">
                        <h6 className="mb-2">Select</h6>
                        <Form.Select
                          className="mb-3"
                          aria-label="Select admin module"
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
                        </Form.Select>
                        <hr />
                        <div className="row">
                          <div className="col-sm-6">
                            <Form.Group className="mb-2">
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
                          </div>
                          <div className="col-sm-6">
                            <Form.Group className="mb-2">
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
                          </div>
                          <Form.Group>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              value={marketInsight.comment || ""}
                              onChange={(e) =>
                                setMarketInsight((prev) => ({
                                  ...prev,
                                  comment: e.target.value,
                                }))
                              }
                            />
                          </Form.Group>
                          <div className="mb-3 mt-3">
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
                            </div>
                          </div>
                        </div>


                      </Card>
                    </Col>

                    {/* India VIX (fetchable) */}
                    <Col md={6}>
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
                            <Button variant="outline-primary" size="sm">
                              Fetch VIX
                            </Button>
                          </Col>

                        </Row>
                        <div className="row mt-3">
                          <div className="col-sm-4">
                            <button className="btn btn-primary">Save</button>

                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="p-3 mb-3">
                        <h6 className="mb-2">Global Markets</h6>
                        <Row className="g-2">
                          <Col md={5}>
                            <Form.Group>
                              <Form.Label>Country</Form.Label>
                              <Form.Select
                                className="mb-3"
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
                              <Form.Label>Currency </Form.Label>
                              <Form.Select
                                className="mb-3"
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
                          <div className="col-sm-12">
                            <Form.Group className="mb-2">
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
                          </div>
                          <Form.Group>
                            <Form.Label>Comment</Form.Label>
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
                        </Row>


                      </Card>
                    </Col>
                  </Row>

                  <Row className="mt-2">
                    <Col>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setMarketInsight(empty);
                          setEditingId(null);
                        }}
                      >
                        Reset
                      </Button>
                    </Col>
                    <Col className="text-end">
                      {editingId && (
                        <Button
                          variant="danger"
                          size="sm"
                          className="me-2"
                          onClick={() => handleDelete(editingId)}
                        >
                          Delete
                        </Button>
                      )}
                      <Button variant="success" size="sm" type="submit">
                        <Save size={14} /> {editingId ? "Update" : "Create"}
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
                        <Form.Control type="date" />
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
                    <Col md={12}>
                      <Form.Check label="Make this phase visible to users" />
                    </Col>
                  </Row>
                  <div className="row mt-2">
                    <div className="col-sm-4">
                      <button className="btn btn-primary">Save</button>

                    </div>
                  </div>
                </Form>
              )}

              {/* ---------------- Market Trend ---------------- */}
              {activeModule === "marketTrend" && (
                <Form>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" />
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

                    <Col md={12}>
                      <Form.Check label="Make this trend visible to users" />
                    </Col>
                  </Row>
                  <div className="row mt-2">
                    <div className="col-sm-4">
                      <button className="btn btn-primary">Save</button>

                    </div>
                  </div>
                </Form>
              )}

              {/* market satup */}
 {activeModule === "marketSatup" && (
  <>
  <MarketSetupForm/>
  </>
 )}


            </>
          )}

          {activeTab === "view" && (
            <>
              <TradeSatupView />
            </>
          )}
        </Card.Body>

        <Card.Footer className="d-flex justify-content-end gap-2">
          <Button variant="secondary" size="sm" >
            Reset
          </Button>
          <Button variant="success" size="sm">
            <Save size={14} /> Save Changes
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default TradeSatup;

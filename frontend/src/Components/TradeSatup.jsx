
import React, { useState } from "react";
import {
  Card,
  Form,
   Nav,
  Row,
  Col,
  Button,
  InputGroup,
 
} from "react-bootstrap";
import { Save, RefreshCw, Plus, Eye } from "lucide-react";
import TradeSatupView from "./TradeSatupView";

const TradeSatup = () => {
  const [activeModule, setActiveModule] = useState("marketInsight"); // marketInsight | marketPhase | marketTrend
  const [activeTab, setActiveTab] = useState("add"); // add | view
  const handleInsightChange = (path, value) => {
    setMarketInsight((prev) => {
      const copy = { ...prev };
      // path like "fii_dii.title" or "dollar_rate.usd_to_inr"
      const keys = path.split(".");
      let cursor = copy;
      keys.forEach((k, i) => {
        if (i === keys.length - 1) cursor[k] = value;
        else cursor[k] = { ...cursor[k] };
        cursor = cursor[k];
      });
      return { ...copy };
    });
  };



  return (
    <div className="trade-setup-admin">
      <Card className="mb-4 shadow-sm">
        <Card.Header className="d-flex align-items-center justify-content-between bg-white">
          <div>
            <h5 className="mb-0">Trade Setup — Admin</h5>
            <small className="text-muted">Choose a module to edit and fill fields below</small>
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


              <Form.Select className="mb-3"
                value={activeModule}
                onChange={(e) => setActiveModule(e.target.value)}
                aria-label="Select admin module"
                style={{ minWidth: 220 }}
              >
                <option value="marketInsight">Market Insight</option>
                <option value="marketPhase">Market Phase</option>
                <option value="marketTrend">Market Trend</option>
              </Form.Select>
              {/* ---------------- Market Insight ---------------- */}
              {activeModule === "marketInsight" && (
                <Form>
                  <Row className="g-3">
                    {/* FII/DII */}
                    <Col md={12}>
                      <Card className="p-3 mb-3">
                        <h6 className="mb-2">Select</h6>
                        <Form.Select className="mb-3"


                          aria-label="Select admin module"
                          style={{ minWidth: 220 }}
                        >
                          <option value="marketInsight">FII/DII data</option>
                          <option value="marketPhase">MPC Meeting aka RBI Meeting</option>

                          <option value="marketTrend">UD Federal Reserve Meeting</option>
                          <option value="marketTrend">GDP Data</option>
                          <option value="marketTrend">Inflation</option>
                          <option value="marketTrend">Automobile Sales Data</option>
                          <option value="marketTrend">Dollar Rate</option>
                          <option value="marketTrend">Crude</option>
                          <option value="marketTrend">Gold</option>
                          <option value="marketTrend">Silver</option>
                          <option value="marketTrend">Government policy Announcement</option>
                          <option value="marketTrend">Global Headline</option>
                          <option value="marketTrend">Stocks in News</option>
                          <option value="marketTrend">About Market</option>

                        </Form.Select>
                        <hr />
                        <div className="row">
                          <div className="col-sm-6">
                            <Form.Group className="mb-2">
                              <Form.Label>Date</Form.Label>
                              <Form.Control
                                type="date"

                              />
                            </Form.Group>
                          </div>
                          <div className="col-sm-6">
                            <Form.Group className="mb-2">
                              <Form.Label>Title</Form.Label>
                              <Form.Control
                                type="text"

                              />
                            </Form.Group>
                          </div>
                          <Form.Group>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}

                            />
                          </Form.Group>
                          {/* Positive / Negative Checkboxes */}
                          <div className="mb-3 mt-3">
                            <label className="form-label fw-semibold d-block">Sentiment</label>
                            <div className="d-flex align-items-center gap-4">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="positiveCheck"
                                />
                                <label className="form-check-label" htmlFor="positiveCheck">
                                  Positive
                                </label>
                              </div>

                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="negativeCheck"
                                />
                                <label className="form-check-label" htmlFor="negativeCheck">
                                  Negative
                                </label>
                              </div>
                            </div>
                          </div>

                        </div>
<div className="row">
  <div className="col-sm-4">
<button className="btn btn-primary">Save</button>

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
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3} className="d-flex align-items-end">
                            <Button variant="outline-primary" size="sm" >
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
                              <Form.Select className="mb-3"

                                aria-label="Select admin module"

                              >
                                <option value="marketInsight">London</option>
                                <option value="marketPhase">japan</option>

                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Currency </Form.Label>
                              <Form.Select className="mb-3"

                                aria-label="Select admin module"

                              >
                                <option value="marketInsight">Pound</option>
                                <option value="marketPhase">Yen</option>

                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <div className="col-sm-12">
                            <Form.Group className="mb-2">
                              <Form.Label>Value</Form.Label>
                              <Form.Control
                                type="text"

                              />
                            </Form.Group>
                          </div>
                          <Form.Group>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}

                            />
                          </Form.Group>

                        </Row>

<div className="row mt-2">
  <div className="col-sm-4">
<button className="btn btn-primary">Save</button>

  </div>
</div>
                      </Card>
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

                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Select

                        >
                          <option>Accumulation</option>
                          <option>Distribution</option>
                          <option>Greed</option>
                          <option>Fear</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}

                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Check
                        label="Make this phase visible to users"

                      />
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
                        <Form.Control
                          type="date"

                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Select

                        >
                          <option>Bullish</option>
                          <option>Bearish</option>
                          <option>Sideways</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}

                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Check
                        label="Make this trend visible to users"

                      />
                    </Col>
                  </Row>
                  <div className="row mt-2">
  <div className="col-sm-4">
<button className="btn btn-primary">Save</button>

  </div>
</div>
                </Form>
              )}
            </>
          )}

          {activeTab === "view" && <TradeSatupView />}
        </Card.Body>

    
      </Card>
    </div>
  );
};

export default TradeSatup;


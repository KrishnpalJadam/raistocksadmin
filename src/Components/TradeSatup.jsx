
import React, { useState } from "react";
import {
  Card,
  Form,
  Row,
  Col,
  Button,
  InputGroup,
} from "react-bootstrap";
import { Save, RefreshCw } from "lucide-react";


const emptyMarketInsight = {
  fii_dii: { title: "", comment: "" },
  mpc_meeting: { title: "", comment: "" },
  fed_meeting: { title: "", comment: "" },
  india_vix: { date: "", value: "", note: "" }, // value usually fetched
  gdp: { title: "", comment: "" },
  inflation: { title: "", comment: "" },
  automobile_sales: { title: "", comment: "" },
  dollar_rate: { date: "", usd_to_inr: "", comment: "" },
  crude: { value: "", comment: "" },
  gold: { value: "", comment: "" },
  silver: { value: "", comment: "" },
  govt_policy: { title: "", comment: "" },
  global_headline: { title: "", comment: "" },
  global_markets: { country: "London", currency: "Pound", value: "", comment: "" },
  stocks_in_news: { date: "", title: "", comment: "" },
  about_market: { date: "", title: "", comment: "" },
  // optional: visibleToUsers flag to control user-side visibility
  visibleToUsers: false,
};

const emptyMarketPhase = {
  date: "",
  title: "Accumulation",
  comment: "",
  visibleToUsers: false,
};

const emptyMarketTrend = {
  date: "",
  title: "Bullish",
  comment: "",
  visibleToUsers: false,
};

const TradeSatup = ({ onSave }) => {
  const [activeModule, setActiveModule] = useState("marketInsight"); // marketInsight | marketPhase | marketTrend

  const [marketInsight, setMarketInsight] = useState(emptyMarketInsight);
  const [marketPhase, setMarketPhase] = useState(emptyMarketPhase);
  const [marketTrend, setMarketTrend] = useState(emptyMarketTrend);

  // UI helpers
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

  const handlePhaseChange = (key, value) =>
    setMarketPhase((p) => ({ ...p, [key]: value }));

  const handleTrendChange = (key, value) =>
    setMarketTrend((p) => ({ ...p, [key]: value }));

  const handleReset = () => {
    setMarketInsight(emptyMarketInsight);
    setMarketPhase(emptyMarketPhase);
    setMarketTrend(emptyMarketTrend);
  };

  const handleSave = () => {
    let payload;
    if (activeModule === "marketInsight") payload = { module: "marketInsight", data: marketInsight };
    if (activeModule === "marketPhase") payload = { module: "marketPhase", data: marketPhase };
    if (activeModule === "marketTrend") payload = { module: "marketTrend", data: marketTrend };

    // UI-only: console.log and call optional onSave handler.
    console.log("TradeSetup SAVE payload:", payload);
    if (typeof onSave === "function") {
      onSave(payload);
    } else {
      // For admin UX, show a temporary visual cue (here: browser alert)
      alert("Saved (UI-only). Check console for payload.\nIntegrate onSave to send to backend.");
    }
  };

  // Simulated VIX fetch (UI-only). In real app, backend should fetch NSE and return value.
  const fetchIndiaVix = () => {
    // placeholder behaviour: set today's date and a fake value
    const today = new Date().toISOString().slice(0, 10);
    setMarketInsight((prev) => ({
      ...prev,
      india_vix: { ...prev.india_vix, date: today, value: "17.23", note: "Fetched (demo)" },
    }));
  };

  return (
    <div className="trade-setup-admin">
      <Card className="mb-4 shadow-sm">
        <Card.Header className="d-flex align-items-center justify-content-between bg-white">
          <div>
            <h5 className="mb-0">Trade Setup — Admin</h5>
            <small className="text-muted">Choose a module to edit and fill fields below</small>
          </div>

          <div className="d-flex gap-2 align-items-center">



          </div>
        </Card.Header>

        <Card.Body>
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
                          value={marketInsight.mpc_meeting.comment}
                          onChange={(e) => handleInsightChange("mpc_meeting.comment", e.target.value)}
                        />
                      </Form.Group>
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
                            value={marketInsight.india_vix.value}
                            onChange={(e) => handleInsightChange("india_vix.value", e.target.value)}
                            placeholder="17.23"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3} className="d-flex align-items-end">
                        <Button variant="outline-primary" size="sm" onClick={fetchIndiaVix}>
                          Fetch VIX
                        </Button>
                      </Col>
                    </Row>
                   
                   
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
                          value={marketInsight.mpc_meeting.comment}
                          onChange={(e) => handleInsightChange("mpc_meeting.comment", e.target.value)}
                        />
                      </Form.Group>

                    </Row>


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
                      value={marketPhase.date}
                      onChange={(e) => handlePhaseChange("date", e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Select
                      value={marketPhase.title}
                      onChange={(e) => handlePhaseChange("title", e.target.value)}
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
                      value={marketPhase.comment}
                      onChange={(e) => handlePhaseChange("comment", e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Check
                    label="Make this phase visible to users"
                    checked={marketPhase.visibleToUsers}
                    onChange={(e) => handlePhaseChange("visibleToUsers", e.target.checked)}
                  />
                </Col>
              </Row>
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
                      value={marketTrend.date}
                      onChange={(e) => handleTrendChange("date", e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Select
                      value={marketTrend.title}
                      onChange={(e) => handleTrendChange("title", e.target.value)}
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
                      value={marketTrend.comment}
                      onChange={(e) => handleTrendChange("comment", e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Check
                    label="Make this trend visible to users"
                    checked={marketTrend.visibleToUsers}
                    onChange={(e) => handleTrendChange("visibleToUsers", e.target.checked)}
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Card.Body>

        <Card.Footer className="d-flex justify-content-end gap-2">
          <Button variant="secondary" size="sm" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="success" size="sm" onClick={handleSave}>
            <Save size={14} /> Save Changes
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default TradeSatup;


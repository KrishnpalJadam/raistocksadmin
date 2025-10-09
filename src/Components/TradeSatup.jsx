
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
                    <h6 className="mb-2">FII / DII Data (Admin)</h6>
                    <Form.Group className="mb-2">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={marketInsight.fii_dii.title}
                        onChange={(e) => handleInsightChange("fii_dii.title", e.target.value)}
                        placeholder="e.g. FII net inflow today"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={marketInsight.fii_dii.comment}
                        onChange={(e) => handleInsightChange("fii_dii.comment", e.target.value)}
                        placeholder="Comment / note for users"
                      />
                    </Form.Group>
                  </Card>
                </Col>

                {/* MPC / Fed / GDP / Inflation */}
                <Col md={6}>
                  <Card className="p-3 mb-3">
                    <h6 className="mb-2">MPC (RBI) Meeting</h6>
                    <Form.Group className="mb-2">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={marketInsight.mpc_meeting.title}
                        onChange={(e) => handleInsightChange("mpc_meeting.title", e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={marketInsight.mpc_meeting.comment}
                        onChange={(e) => handleInsightChange("mpc_meeting.comment", e.target.value)}
                      />
                    </Form.Group>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="p-3 mb-3">
                    <h6 className="mb-2">Federal Reserve Meeting (UD)</h6>
                    <Form.Group className="mb-2">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={marketInsight.fed_meeting.title}
                        onChange={(e) => handleInsightChange("fed_meeting.title", e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={marketInsight.fed_meeting.comment}
                        onChange={(e) => handleInsightChange("fed_meeting.comment", e.target.value)}
                      />
                    </Form.Group>
                  </Card>
                </Col>

                {/* India VIX (fetchable) */}
                <Col md={6}>
                  <Card className="p-3 mb-3">
                    <h6 className="mb-2">India VIX (Previous Close)</h6>
                    <Row className="g-2">
                      <Col md={5}>
                        <Form.Group>
                          <Form.Label>Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={marketInsight.india_vix.date}
                            onChange={(e) => handleInsightChange("india_vix.date", e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
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
                    <Form.Group className="mt-2">
                      <Form.Label>Note</Form.Label>
                      <Form.Control
                        type="text"
                        value={marketInsight.india_vix.note}
                        onChange={(e) => handleInsightChange("india_vix.note", e.target.value)}
                      />
                    </Form.Group>
                    <small className="text-muted">
                      Suggestion: Backend should fetch from NSE and populate `india_vix.value` and `date`.
                    </small>
                  </Card>
                </Col>

                {/* GDP & Inflation */}
                <Col md={6}>
                  <Card className="p-3 mb-3">
                    <h6 className="mb-2">GDP / Inflation / Auto Sales</h6>
                    <Form.Group className="mb-2">
                      <Form.Label>GDP Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={marketInsight.gdp.title}
                        onChange={(e) => handleInsightChange("gdp.title", e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>GDP Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={marketInsight.gdp.comment}
                        onChange={(e) => handleInsightChange("gdp.comment", e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Inflation Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={marketInsight.inflation.title}
                        onChange={(e) => handleInsightChange("inflation.title", e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Inflation Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={marketInsight.inflation.comment}
                        onChange={(e) => handleInsightChange("inflation.comment", e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Automobile Sales Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={marketInsight.automobile_sales.title}
                        onChange={(e) => handleInsightChange("automobile_sales.title", e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Automobile Sales Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={marketInsight.automobile_sales.comment}
                        onChange={(e) => handleInsightChange("automobile_sales.comment", e.target.value)}
                      />
                    </Form.Group>
                  </Card>
                </Col>

                {/* Dollar / Commodities */}
                <Col md={6}>
                  <Card className="p-3 mb-3">
                    <h6 className="mb-2">Dollar / Commodities</h6>
                    <Form.Group className="mb-2">
                      <Form.Label>Dollar Rate Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={marketInsight.dollar_rate.date}
                        onChange={(e) => handleInsightChange("dollar_rate.date", e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>1 USD = (INR)</Form.Label>
                      <Form.Control
                        type="number"
                        value={marketInsight.dollar_rate.usd_to_inr}
                        onChange={(e) => handleInsightChange("dollar_rate.usd_to_inr", e.target.value)}
                        step="0.01"
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Dollar Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={marketInsight.dollar_rate.comment}
                        onChange={(e) => handleInsightChange("dollar_rate.comment", e.target.value)}
                      />
                    </Form.Group>

                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <Form.Label>Crude (USD)</Form.Label>
                          <Form.Control
                            type="number"
                            value={marketInsight.crude.value}
                            onChange={(e) => handleInsightChange("crude.value", e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <Form.Label>Gold (INR/10gm)</Form.Label>
                          <Form.Control
                            type="number"
                            value={marketInsight.gold.value}
                            onChange={(e) => handleInsightChange("gold.value", e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <Form.Label>Silver (INR/kg)</Form.Label>
                          <Form.Control
                            type="number"
                            value={marketInsight.silver.value}
                            onChange={(e) => handleInsightChange("silver.value", e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mt-2">
                      <Form.Label>Commodities Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={marketInsight.crude.comment}
                        onChange={(e) => handleInsightChange("crude.comment", e.target.value)}
                        placeholder="Shared comment for crude/gold/silver"
                      />
                    </Form.Group>
                  </Card>
                </Col>

                {/* Government / Global / Stocks / About */}
                <Col md={12}>
                  <Card className="p-3 mb-3">
                    <h6 className="mb-2">Government / Global / Stocks / About</h6>
                    <Row className="g-2">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Government Policy Title</Form.Label>
                          <Form.Control
                            type="text"
                            value={marketInsight.govt_policy.title}
                            onChange={(e) => handleInsightChange("govt_policy.title", e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Global Headline Title</Form.Label>
                          <Form.Control
                            type="text"
                            value={marketInsight.global_headline.title}
                            onChange={(e) => handleInsightChange("global_headline.title", e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="g-2 mt-2">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Government Policy Comment</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={marketInsight.govt_policy.comment}
                            onChange={(e) => handleInsightChange("govt_policy.comment", e.target.value)}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Global Headline Comment</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={marketInsight.global_headline.comment}
                            onChange={(e) => handleInsightChange("global_headline.comment", e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <hr />

                    <Row className="g-2">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Global Market — Country</Form.Label>
                          <Form.Select
                            value={marketInsight.global_markets.country}
                            onChange={(e) => handleInsightChange("global_markets.country", e.target.value)}
                          >
                            <option>London</option>
                            <option>Japan</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Currency</Form.Label>
                          <Form.Select
                            value={marketInsight.global_markets.currency}
                            onChange={(e) => handleInsightChange("global_markets.currency", e.target.value)}
                          >
                            <option>Pound</option>
                            <option>Yen</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Value</Form.Label>
                          <Form.Control
                            type="number"
                            value={marketInsight.global_markets.value}
                            onChange={(e) => handleInsightChange("global_markets.value", e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mt-2">
                      <Form.Label>Global Markets Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={marketInsight.global_markets.comment}
                        onChange={(e) => handleInsightChange("global_markets.comment", e.target.value)}
                      />
                    </Form.Group>

                    <hr />

                    <Row className="g-2">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Stocks in News — Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={marketInsight.stocks_in_news.date}
                            onChange={(e) => handleInsightChange("stocks_in_news.date", e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Stocks in News — Title</Form.Label>
                          <Form.Control
                            type="text"
                            value={marketInsight.stocks_in_news.title}
                            onChange={(e) => handleInsightChange("stocks_in_news.title", e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>About Market — Date</Form.Label>
                          <Form.Control
                            type="date"
                            value={marketInsight.about_market.date}
                            onChange={(e) => handleInsightChange("about_market.date", e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="g-2 mt-2">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Stocks in News — Comment</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={marketInsight.stocks_in_news.comment}
                            onChange={(e) => handleInsightChange("stocks_in_news.comment", e.target.value)}
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>About Market — Title & Comment</Form.Label>
                          <InputGroup className="mb-2">
                            <Form.Control
                              type="text"
                              placeholder="Title"
                              value={marketInsight.about_market.title}
                              onChange={(e) => handleInsightChange("about_market.title", e.target.value)}
                            />
                          </InputGroup>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Comment"
                            value={marketInsight.about_market.comment}
                            onChange={(e) => handleInsightChange("about_market.comment", e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Check
                      type="checkbox"
                      className="mt-3"
                      label="Make these updates visible to users"
                      checked={marketInsight.visibleToUsers}
                      onChange={(e) => handleInsightChange("visibleToUsers", e.target.checked)}
                    />
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


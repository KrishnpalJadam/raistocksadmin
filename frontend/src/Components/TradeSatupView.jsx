import React, { useEffect, useMemo, useState } from "react";
import { Card, Table, Button, Form } from "react-bootstrap";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketInsights } from "../slices/marketInsightSlice";
import { fetchMarketPhases } from "../slices/marketPhaseSlice";
import { fetchMarketTrends } from "../slices/marketTrendSlice";

const TradeSatupView = () => {
  const [filter, setFilter] = useState("all");
  const dispatch = useDispatch();

  const { items: insights = [] } = useSelector((s) => s.marketInsights || {});
  const { items: phases = [] } = useSelector((s) => s.marketPhases || {});
  const { items: trends = [] } = useSelector((s) => s.marketTrends || {});

  useEffect(() => {
    dispatch(fetchMarketInsights());
    dispatch(fetchMarketPhases());
    dispatch(fetchMarketTrends());
  }, [dispatch]);

  const combined = useMemo(() => {
    const ins = insights.map((it) => ({
      id: it._id,
      module: "Market Insight",
      title: it.title,
      comment: it.comment || it.globalcomment || null,
      sentiment: it.sentiment === undefined ? null : it.sentiment,
      date: it.date,
    }));

    const phs = phases.map((p) => ({
      id: p._id,
      module: "Market Phase",
      title: p.title,
      comment: p.description || null,
      sentiment: null,
      date: p.date,
    }));

    const trs = trends.map((t) => ({
      id: t._id,
      module: "Market Trend",
      title: t.title,
      comment: t.description || null,
      sentiment: null,
      date: t.date,
    }));

    return [...ins, ...phs, ...trs].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [insights, phases, trends]);

  const list = useMemo(() => {
    if (filter === "all") return combined;
    if (filter === "marketInsight")
      return combined.filter((c) => c.module === "Market Insight");
    if (filter === "marketPhase")
      return combined.filter((c) => c.module === "Market Phase");
    if (filter === "marketTrend")
      return combined.filter((c) => c.module === "Market Trend");
    return combined;
  }, [combined, filter]);

  const short = (s) => {
    if (s === null || s === undefined) return "";
    const str = String(s);
    if (str.length <= 20) return str;
    return str.slice(0, 20) + "..";
  };

  return (
    <div className="trade-setup-view">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">View Trade Setups</h5>
        <Form.Select
          size="sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: 220 }}
        >
          <option value="all">All Modules</option>
          <option value="marketInsight">Market Insight</option>
          <option value="marketPhase">Market Phase</option>
          <option value="marketTrend">Market Trend</option>
        </Form.Select>
      </div>

      <Card className="border">
        <Table responsive hover className="mb-0">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Module</th>
              <th>Title</th>
              <th>Comment</th>
              <th>Sentiment</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, i) => (
              <tr key={item.id || i}>
                <td>{i + 1}</td>
                <td>
                  {item.date
                    ? new Date(item.date).toISOString().slice(0, 10)
                    : ""}
                </td>
                <td>{item.module}</td>
                <td>{item.title}</td>
                <td>{short(item.comment)}</td>
                <td>
                  {item.sentiment ? (
                    <span
                      className={`badge ${
                        item.sentiment === "Positive"
                          ? "bg-success"
                          : item.sentiment === "Negative"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {item.sentiment}
                    </span>
                  ) : (
                    ""
                  )}
                </td>
                <td className="text-end">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    className="me-2"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </Button>
                  <Button size="sm" variant="outline-secondary" title="View">
                    <Eye size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default TradeSatupView;

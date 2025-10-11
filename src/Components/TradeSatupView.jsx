import React, { useState } from "react";
import { Card, Table, Button, Form } from "react-bootstrap";
import { Pencil, Trash2, Eye } from "lucide-react";

const TradeSatupView = () => {
  const [filter, setFilter] = useState("all");

  const data = [
    {
      id: 1,
      module: "Market Insight",
      title: "FII/DII Data",
      comment: "Foreign investors were net buyers",
      sentiment: "Positive",
      date: "2025-10-09",
    },
    {
      id: 2,
      module: "Market Phase",
      title: "Distribution",
      comment: "Market showing signs of correction",
      sentiment: "Negative",
      date: "2025-10-08",
    },
  ];

  return (
    <div className="trade-setup-view">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">View Trade Setups</h5>
        <Form.Select
          size="sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: 180 }}
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
            {data.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.date}</td>
                <td>{item.module}</td>
                <td>{item.title}</td>
                <td>{item.comment}</td>
                <td>
                  <span
                    className={`badge ${
                      item.sentiment === "Positive"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {item.sentiment}
                  </span>
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

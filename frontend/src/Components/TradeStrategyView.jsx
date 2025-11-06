import React, { useEffect, useMemo } from "react";
import { Card, Table, Button } from "react-bootstrap";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTradeStrategies,
  deleteTradeStrategy,
} from "../slices/tradeStrategySlice";

const TradeStrategyView = () => {
  const dispatch = useDispatch();
  const { items: strategies = [], loading } = useSelector(
    (state) => state.tradeStrategies || {}
  );

  useEffect(() => {
    dispatch(fetchTradeStrategies());
  }, [dispatch]);

  const list = useMemo(() => {
    return [...strategies].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [strategies]);


  const short = (s) => {
    if (!s) return "";
    return s.length > 30 ? s.slice(0, 30) + "..." : s;
  };

  const handleDelete = (item) => {
    if (!window.confirm(`Delete Trade Strategy "${item.title}"?`)) return;
    dispatch(deleteTradeStrategy(item._id));
  };

  return (
    <div className="trade-strategy-view">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">View Trade Strategies</h5>
      </div>

      <Card className="border">
        <Table responsive hover className="mb-0">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Title</th>
              <th>Description</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, i) => (
              <tr key={item._id || i}>
                <td>{i + 1}</td>
                <td>
                  {item.date
                    ? new Date(item.date).toISOString().slice(0, 10)
                    : ""}
                </td>
                <td>{item.title}</td>
                <td>{short(item.description)}</td>
                <td className="text-end">
                  <Button
                    size="sm"
                    variant="outline-danger"
                    title="Delete"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}

            {!loading && list.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  No trade strategies found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default TradeStrategyView;

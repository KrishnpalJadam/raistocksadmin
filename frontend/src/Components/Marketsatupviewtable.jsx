import React, { useEffect, useState } from "react";
import { Card, Table, Button, Modal, Image, Spinner } from "react-bootstrap";
import { Eye, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketSetups, deleteMarketSetup } from "../slices/marketSetupSlice"; // ✅ make sure paths are correct

const MarketSetupViewTable = () => {
  const dispatch = useDispatch();
  const { setups, loading } = useSelector((state) => state.marketSetup);

  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMarketSetups());
  }, [dispatch]);

  const handleView = (item) => {
    setSelected(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      dispatch(deleteMarketSetup(id));
    }
  };

  const shortText = (text) =>
    text && text.length > 20 ? text.slice(0, 20) + "..." : text;

  return (
    <div className="market-setup-view">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Market Setup List</h5>
      </div>

      <Card className="border shadow-sm">
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>On What</th>
                <th>Phase</th>
                <th>Trend</th>
                <th>Chart Pattern</th>
                <th>Candle Pattern</th>
                <th>Comment</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {setups && setups.length > 0 ? (
                setups.map((item, i) => (
                  <tr key={item._id}>
                    <td>{i + 1}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>{item.on}</td>
                    <td>{item.phase}</td>
                    <td>{item.trend}</td>
                    <td>{item.chartPattern}</td>
                    <td>{item.candlePattern}</td>
                    <td>{shortText(item.chartPatternComment || item.supportResistanceComment)}</td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        className="me-2"
                        onClick={() => handleView(item)}
                        title="View"
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(item._id)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    No market setups found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card>

      {/* Modal for Viewing Full Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Market Setup Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <div className="d-flex flex-column gap-2">
              <p><strong>Date:</strong> {new Date(selected.createdAt).toLocaleString()}</p>
              <p><strong>On What:</strong> {selected.on}</p>

              <h6>Support Levels:</h6>
              <ul>
                {selected.supportLevels?.map((level, idx) => (
                  <li key={idx}>S{idx + 1}: {level}</li>
                ))}
              </ul>

              <h6>Resistance Levels:</h6>
              <ul>
                {selected.resistanceLevels?.map((level, idx) => (
                  <li key={idx}>R{idx + 1}: {level}</li>
                ))}
              </ul>

              <p><strong>Support/Resistance Comment:</strong> {selected.supportResistanceComment}</p>

              <p><strong>Phase:</strong> {selected.phase}</p>
              <p><strong>Phase Comment:</strong> {selected.phaseComment}</p>

              <p><strong>Trend:</strong> {selected.trend}</p>
              <p><strong>Trend Comment:</strong> {selected.trendComment}</p>

              <p><strong>Chart Pattern:</strong> {selected.chartPattern}</p>
              <p><strong>Chart Pattern Comment:</strong> {selected.chartPatternComment}</p>

              <p><strong>Candle Pattern:</strong> {selected.candlePattern}</p>
              <p><strong>Candle Pattern Comment:</strong> {selected.candlePatternComment}</p>

              <h6>Breakout / Retest Events:</h6>
              <ul>
                {selected.breakoutEvents?.map((ev, idx) => (
                  <li key={idx}>{ev.formation} - {ev.eventComment}</li>
                ))}
              </ul>

              {selected.imageUrl && (
                <div>
                  <strong>Uploaded Image:</strong>
                  <br />
                  <Image src={selected.imageUrl} fluid />
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MarketSetupViewTable;

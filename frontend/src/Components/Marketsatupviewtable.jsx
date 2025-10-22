import React, { useState } from "react";
import { Card, Table, Button, Modal, Image } from "react-bootstrap";
import { Eye, Trash2 } from "lucide-react";

const MarketSetupViewTable = () => {
    // Dummy data
    const [data, setData] = useState([
        {
            id: 1,
            date: "2025-10-21",
            onWhat: "Bank Nifty",
            support: { S1: "40000", S2: "39800", S3: "39600", comment: "Strong support" },
            resistance: { R1: "40500", R2: "40700", R3: "41000", comment: "Resistance holding" },
            phase: "Accumulation",
            phaseComment: "Market slowly accumulating",
            trend: "Bullish",
            trendComment: "Uptrend visible",
            chartPattern: "Head & Shoulder",
            chartPatternComment: "Classic pattern forming",
            candlePattern: "Bullish Marubozu",
            candlePatternComment: "Strong bullish candle",
            breakoutEvents: [
                { event: "Formation", comment: "Pattern formed" },
                { event: "Breakout", comment: "Breakout confirmed" },
            ],
            image: null,
        },
        {
            id: 2,
            date: "2025-10-20",
            onWhat: "Reliance",
            support: { S1: "2200", S2: "2180", S3: "2150", comment: "" },
            resistance: { R1: "2250", R2: "2270", R3: "2300", comment: "Resistance tested" },
            phase: "Distribution",
            phaseComment: "",
            trend: "Bearish",
            trendComment: "Downtrend starting",
            chartPattern: "Double Top",
            chartPatternComment: "",
            candlePattern: "Bearish Engulfing",
            candlePatternComment: "",
            breakoutEvents: [{ event: "Neckline Broken", comment: "Strong breakdown" }],
            image: null,
        },
    ]);

    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleView = (item) => {
        setSelected(item);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            setData(data.filter((d) => d.id !== id));
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
                        {data.map((item, i) => (
                            <tr key={item.id}>
                                <td>{i + 1}</td>
                                <td>{item.date}</td>
                                <td>{item.onWhat}</td>
                                <td>{item.phase}</td>
                                <td>{item.trend}</td>
                                <td>{item.chartPattern}</td>
                                <td>{item.candlePattern}</td>
                                <td>{shortText(item.chartPatternComment || item.comment)}</td>
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
                                        onClick={() => handleDelete(item.id)}
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            {/* Modal for Viewing Full Details */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Market Setup Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selected && (
                        <div className="d-flex flex-column gap-2">
                            <p><strong>Date:</strong> {selected.date}</p>
                            <p><strong>On What:</strong> {selected.onWhat}</p>

                            <h6>Support Levels:</h6>
                            <ul>
                                <li>S1: {selected.support.S1}</li>
                                <li>S2: {selected.support.S2}</li>
                                <li>S3: {selected.support.S3}</li>
                                <li>Comment: {selected.support.comment}</li>
                            </ul>

                            <h6>Resistance Levels:</h6>
                            <ul>
                                <li>R1: {selected.resistance.R1}</li>
                                <li>R2: {selected.resistance.R2}</li>
                                <li>R3: {selected.resistance.R3}</li>
                                <li>Comment: {selected.resistance.comment}</li>
                            </ul>

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
                                {selected.breakoutEvents.map((ev, idx) => (
                                    <li key={idx}>
                                        {ev.event} - {ev.comment}
                                    </li>
                                ))}
                            </ul>

                            {selected.image && (
                                <div>
                                    <strong>Uploaded Image:</strong>
                                    <br />
                                    <Image src={URL.createObjectURL(selected.image)} fluid />
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

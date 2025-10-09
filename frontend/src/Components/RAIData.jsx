






import React, { useState, useMemo } from "react";
import {
    Card,
    Table,
    Button,
    Form,
    Row,
    Col,
    Pagination,
    Modal,
} from "react-bootstrap";
import {
    Search,
    Edit,
    Plus,
    Target,
    Eye,
    Trash2,
    User,
} from "lucide-react";

const RAIData = () => {
    const [trades, setTrades] = useState([
        {
            id: 1,
            title: "Buy Banknifty 56000 CE 31 July exp at 277",
            segment: "Index option",
            tradeType: "Intraday",
            action: "Buy",
            on: "Banknifty",
            entry: 277,
            target1: 344,
            target2: 384,
            target3: 436,
            stoploss: 207,
            duration: "Today",
            weightageValue: 6,
            weightageExtension: "% of your capital",
            lotSize: 30,
            lots: 1,
            date: "2025-10-08T10:30",
            status: "Closed",
            result: "Profit",
            pnl: 5280,
        },
         {
            id: 2,
            title: "Buy Banknifty 56000 CE 31 July exp at 277",
            segment: "Index option",
            tradeType: "Intraday",
            action: "Buy",
            on: "Banknifty",
            entry: 277,
            target1: 344,
            target2: 384,
            target3: 436,
            stoploss: 207,
            duration: "Today",
            weightageValue: 6,
            weightageExtension: "% of your capital",
            lotSize: 30,
            lots: 1,
            date: "2025-10-08T10:30",
            status: "Closed",
            result: "Profit",
            pnl: 5280,
        },
         {
            id: 3,
            title: "Buy Banknifty 56000 CE 31 July exp at 277",
            segment: "Index option",
            tradeType: "Intraday",
            action: "Buy",
            on: "Banknifty",
            entry: 277,
            target1: 344,
            target2: 384,
            target3: 436,
            stoploss: 207,
            duration: "Today",
            weightageValue: 6,
            weightageExtension: "% of your capital",
            lotSize: 30,
            lots: 1,
            date: "2025-10-08T10:30",
            status: "Closed",
            result: "Profit",
            pnl: 5280,
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTrade, setSelectedTrade] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [AddshowModal, AddsetShowModal] = useState(false);

    const ITEMS_PER_PAGE = 10;

    const filteredTrades = useMemo(() => {
        return trades.filter((trade) =>
            trade.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, trades]);

    const totalPages = Math.ceil(filteredTrades.length / ITEMS_PER_PAGE);
    const paginatedTrades = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTrades.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredTrades, currentPage]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const getBadgeClass = (result) => {
        if (result === "Profit") return "text-success fw-bold";
        if (result === "Loss") return "text-danger fw-bold";
        return "text-primary";
    };

    const handleView = (trade) => {
        setSelectedTrade(trade);
        setShowModal(true);
    };
     const AddhandleView = (trade) => {
        
        AddsetShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this trade?")) {
            setTrades(trades.filter((t) => t.id !== id));
        }
    };

    return (
        <div className="page-content">
            
<Modal show={AddshowModal} onHide={() => AddsetShowModal(false)} size="lg" centered className="trade-view-modal" > <Modal.Header closeButton className="bg-primary bg-opacity-10 border-bottom"> <Modal.Title className="fw-bold text-primary">  <Plus className="me-2 text-success" /> Add New Trade</Modal.Title> </Modal.Header> <Modal.Body className="p-4"> 
     <div className="mb-4  p-0"> 
                 <Card.Header className="bg-white fw-bold d-flex align-items-center">
                      </Card.Header>
                       <Card.Body> <Form> <Row className="g-3"> {/* Trade Title */} 

                         {/* Segment */} <Col md={4}> <Form.Group> <Form.Label>Segment</Form.Label> <Form.Select defaultValue="Cash"> <option>Cash</option> <option>Index future</option> <option>Index option</option> <option>Commodity future</option> <option>Commodity option</option> <option>Stock future</option> <option>Stock option</option> </Form.Select> </Form.Group> </Col> {/* Trade Type */} <Col md={4}> <Form.Group> <Form.Label>Trade Type</Form.Label> <Form.Select> <option>Swing</option> <option>Intraday</option> <option>Scalp</option> <option>Invest</option> <option>Strategy</option> </Form.Select> </Form.Group> </Col> {/* Action */} <Col md={4}> <Form.Group> <Form.Label>Action</Form.Label> <Form.Select> <option>Buy</option> <option>Sell</option> <option>Long</option> <option>Short</option> </Form.Select> </Form.Group> </Col> {/* On */} <Col md={6}> <Form.Group> <Form.Label>On</Form.Label> <Form.Control type="text" placeholder="Banknifty / Reliance etc." /> </Form.Group> </Col> {/* Entry Price */} <Col md={3}> <Form.Group> <Form.Label>Entry Price</Form.Label> <Form.Control type="number" placeholder="277" /> </Form.Group> </Col> {/* Stoploss */} <Col md={3}> <Form.Group> <Form.Label>Stoploss</Form.Label> <Form.Control type="text" placeholder="207 or NA" /> </Form.Group> </Col> {/* Targets */} <Col md={4}> <Form.Group> <Form.Label>Target 1</Form.Label> <Form.Control type="number" placeholder="344" /> </Form.Group> </Col> <Col md={4}> <Form.Group> <Form.Label>Target 2</Form.Label> <Form.Control type="number" placeholder="384" /> </Form.Group> </Col> <Col md={4}> <Form.Group> <Form.Label>Target 3</Form.Label> <Form.Control type="number" placeholder="436" /> </Form.Group> </Col> {/* Duration */} <Col md={6}> <Form.Group> <Form.Label>Time Duration</Form.Label> <Form.Select> <option>Today</option> <option>Tomorrow</option> <option>15 Days</option> <option>1 to 2 Months</option> <option>1 to 3 Months</option> <option>1 to 4 Months</option> <option>1 to 6 Months</option> <option>2 to 3 months</option> <option>2 to 4 Months</option> <option>3 to 6 Months</option> <option>3 Months to 1 Year</option> <option>3 Months to 2 Years</option> <option>4 Months to 1 Year</option> <option>6 Months to 1 Year</option> <option>6 Months to 2 Years</option> <option>1 to 2 Years</option> <option>1 to 3 Years</option> </Form.Select> </Form.Group> </Col> {/* Weightage */} <Col md={3}> <Form.Group> <Form.Label>Weightage Value</Form.Label> <Form.Control type="number" placeholder="6" /> </Form.Group> </Col> <Col md={3}> <Form.Group> <Form.Label>Weightage Extension</Form.Label> <Form.Select> <option>% of your capital</option> <option>% of your capital or minimum 1 lot</option> </Form.Select> </Form.Group> </Col> {/* Lot Size & Lots */} <Col md={3}> <Form.Group> <Form.Label>Lot Size</Form.Label> <Form.Control type="number" placeholder="Optional" /> </Form.Group> </Col> <Col md={3}> <Form.Group> <Form.Label>Lots</Form.Label> <Form.Control type="number" defaultValue={1} /> </Form.Group> </Col> {/* Date & Time */} <Col md={6}> <Form.Group> <Form.Label>Recommendation Date & Time</Form.Label> <Form.Control type="datetime-local" /> </Form.Group> </Col><Col md={4}> <Form.Group> <Form.Label>Status</Form.Label> <Form.Select > <option>Select</option> <option>Live</option> <option>close</option> </Form.Select> </Form.Group> </Col>  </Row> <div className="mt-4 text-end"> <Button type="submit" variant="success"> Add Trade </Button> </div> </Form> </Card.Body> </div>
     </Modal.Body> <Modal.Footer className="bg-light border-top"> <Button variant="outline-secondary" className="px-4" onClick={() => setShowModal(false)} > Close </Button> </Modal.Footer> </Modal>
            {/* --- Trade Table --- */}
            <Card className="shadow-sm">
                <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <Target className="text-primary me-2" />
                        All Trades Log
                    </h5>
                    <Form className="d-flex align-items-center">
                        <Search className="me-2 text-secondary" />
                        <Form.Control
                            type="text"
                            placeholder="Search trade title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Form>
                    <button className="btn btn-primary" onClick={AddhandleView}>+ Add Trade</button>
                </Card.Header>

                <Card.Body>
                    <Table responsive hover className="align-middle text-nowrap">
                        <thead>
                            <tr>
                                <th>#</th>
                               
                                <th>Segment</th>
                                <th>Type</th>
                                <th>Action</th>
                                <th>On</th>
                                <th>Entry</th>
                                <th>Targets</th>
                                <th>Stoploss</th>
                                <th>Duration</th>
                                <th>Weightage</th>
                                <th>Lot Size</th>
                                <th>Lots</th>
                                <th>Status</th>
                                <th>Result</th>
                                <th>PnL</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTrades.length > 0 ? (
                                paginatedTrades.map((t) => (
                                    <tr key={t.id}>
                                        <td>{t.id}</td>
                                      
                                        <td>{t.segment}</td>
                                        <td>{t.tradeType}</td>
                                        <td>{t.action}</td>
                                        <td>{t.on}</td>
                                        <td>₹{t.entry}</td>
                                        <td>
                                            {t.target1}, {t.target2}, {t.target3}
                                        </td>
                                        <td>{t.stoploss}</td>
                                        <td>{t.duration}</td>
                                        <td>
                                            {t.weightageValue} {t.weightageExtension}
                                        </td>
                                        <td>{t.lotSize}</td>
                                        <td>{t.lots}</td>
                                        <td>
                                            <span
                                                className={`badge bg-${t.status === "Live" ? "info" : "secondary"
                                                    }`}
                                            >
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className={getBadgeClass(t.result)}>{t.result}</td>
                                        <td>
                                            {t.pnl
                                                ? t.pnl > 0
                                                    ? `+₹${t.pnl}`
                                                    : `-₹${Math.abs(t.pnl)}`
                                                : "-"}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    onClick={() => handleView(t)}
                                                >
                                                    <Eye size={16} />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => handleDelete(t.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="17" className="text-center text-muted py-4">
                                        No trades found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-3">
                            <Pagination>
                                <Pagination.First
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                />
                                <Pagination.Prev
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                />
                                {[...Array(totalPages)].map((_, i) => (
                                    <Pagination.Item
                                        key={i + 1}
                                        active={currentPage === i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                />
                                <Pagination.Last
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                />
                            </Pagination>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* --- View Modal --- */} <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="trade-view-modal" > <Modal.Header closeButton className="bg-primary bg-opacity-10 border-bottom"> <Modal.Title className="fw-bold text-primary"> <Eye className="me-2 text-primary" size={18} /> Trade Details </Modal.Title> </Modal.Header> <Modal.Body className="p-4"> {selectedTrade ? (<div className="table-responsive"> <Table hover bordered className="align-middle"> <tbody> {Object.entries(selectedTrade).map(([key, value]) => (<tr key={key}> <td style={{ width: "35%", backgroundColor: "#f8f9fa", fontWeight: "600", textTransform: "capitalize", color: "#495057", }} > {key.replace(/([A-Z])/g, " $1")} </td> <td style={{ color: "#212529", fontWeight: "500", }} > {Array.isArray(value) ? value.join(", ") : value ? String(value) : "-"} </td> </tr>))} </tbody> </Table> </div>) : (<div className="text-center text-muted py-4">No trade selected.</div>)} </Modal.Body> <Modal.Footer className="bg-light border-top"> <Button variant="outline-secondary" className="px-4" onClick={() => setShowModal(false)} > Close </Button> </Modal.Footer> </Modal>
        </div>
    );
};

export default RAIData;


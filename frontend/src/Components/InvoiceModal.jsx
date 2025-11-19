// import React from 'react';
// import { Modal, Button, Table, Row, Col } from 'react-bootstrap';
// import { Download, Printer } from 'lucide-react';

// const InvoiceModal = ({ show, handleClose, invoiceData }) => {
//     console.log("💡 Invoice Data:", invoiceData);
//     if (!invoiceData) {
//         invoiceData = {
//             id: 'GST-INV-2024-00123',
//             clientName: 'Sample Client Name',
//             date: '2025-10-01',
//             gstin: '27AAAAA1234A1Z5',
//             items: [
//                 { description: 'Investor Plan (Quarterly)', amount: 25000.00 },
//             ],
//             taxRate: 0.18, // 18% GST
//             totalAmount: 29500.00,
//         };
//     }

//     const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
//     const gstAmount = subtotal * invoiceData.taxRate;
//     const totalPayable = subtotal + gstAmount;

//     return (
//         <Modal show={show} onHide={handleClose} size="lg" centered>
//             <Modal.Header closeButton className="bg-light">
//                 <Modal.Title>📑 GST Invoice: {invoiceData.id}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <div className="p-3 border rounded">
//                     <Row className="mb-4">
//                         <Col>
//                             <h4 className="text-primary">CRM Financials</h4>
//                             <p className="mb-0">123 Main Street, Mumbai, 400001</p>
//                             <p className="mb-0">GSTIN: 27AAAAA0000A1Z5</p>
//                         </Col>
//                         <Col className="text-end">
//                             <h5 className="mb-0">Invoice No: {invoiceData.id}</h5>
//                             <p className="mb-0">Date: {invoiceData.date}</p>
//                         </Col>
//                     </Row>

//                     <Row className="mb-4">
//                         <Col>
//                             <h6>Bill To:</h6>
//                             <p className="mb-0"><strong>{invoiceData.clientName}</strong></p>
//                             <p className="mb-0">Client GSTIN: {invoiceData.gstin}</p>
//                         </Col>
//                     </Row>

//                     <h6>Invoice Details:</h6>
//                     <Table bordered striped size="sm" className="mb-4">
//                         <thead>
//                             <tr className="bg-light">
//                                 <th>Description</th>
//                                 <th className="text-end">Taxable Value (₹)</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {invoiceData.items.map((item, index) => (
//                                 <tr key={index}>
//                                     <td>{item.description}</td>
//                                     <td className="text-end">₹{item.amount.toLocaleString('en-IN')}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>

//                     <Row className="justify-content-end">
//                         <Col md={5}>
//                             <Table borderless size="sm">
//                                 <tbody>
//                                     <tr>
//                                         <td>Sub Total:</td>
//                                         <td className="text-end">₹{subtotal.toLocaleString('en-IN')}</td>
//                                     </tr>
//                                     <tr>
//                                         <td>GST ({invoiceData.taxRate * 100}%):</td>
//                                         <td className="text-end text-success">₹{gstAmount.toLocaleString('en-IN')}</td>
//                                     </tr>
//                                     <tr className="border-top border-2">
//                                         <td><strong>Total Amount Due:</strong></td>
//                                         <td className="text-end"><strong>₹{totalPayable.toLocaleString('en-IN')}</strong></td>
//                                     </tr>
//                                 </tbody>
//                             </Table>
//                         </Col>
//                     </Row>
//                 </div>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={handleClose}>
//                     Close
//                 </Button>
//                 <Button variant="outline-primary">
//                     <Download className="lucide-icon me-2" /> Download PDF
//                 </Button>
//                 <Button variant="primary">
//                     <Printer className="lucide-icon me-2" /> Print Invoice
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };

// export default InvoiceModal;






import React from "react";
import { Modal, Button, Table, Row, Col } from "react-bootstrap";
import { Download, Printer } from "lucide-react";
import logo2 from "../assets/image/logo.png"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
const InvoiceModal = ({ show, handleClose, invoiceData }) => {
  if (!invoiceData) return null;
  const invoiceRef = useRef();
  const subtotal = invoiceData.items.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const downloadPDF = async () => {
    const element = invoiceRef.current;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(`Invoice-${invoiceData.id}.pdf`);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>GST Invoice: {invoiceData.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="p-3 border rounded" ref={invoiceRef}>

          <Row className="mb-4">
            <Col>
              <img src={logo2} alt="" />
              <h4 className="text-primary">Raistocks.com</h4>
              <p className="mb-0">{invoiceData.companyAddress}</p>
              <p className="mb-0">GSTIN: 22FNBPS4078F1ZY</p>
            </Col>
            <Col className="text-end">
              <h5 className="mb-0">Invoice No: {invoiceData.id}</h5>
              <p className="mb-0">Date: {invoiceData.date}</p>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <h6>Bill To:</h6>
              <p className="mb-0">
                <strong>{invoiceData.clientName}</strong>
              </p>
              <p className="mb-0">Phone: {invoiceData.phone}</p>
              <p className="mb-0">Email: {invoiceData.email}</p>
              <p className="mb-0">State: {invoiceData.state}</p>
            </Col>
          </Row>

          <h6>Invoice Details:</h6>
          <Table bordered striped size="sm" className="mb-4">
            <thead>
              <tr className="bg-light">
                <th>Description</th>
                <th className="text-end">Taxable Value (₹)</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td className="text-end">
                    ₹
                    {item.amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Row className="justify-content-end">
            <span className="">HSN/SAC: 998371</span>
            <Col md={5}>
              <Table borderless size="sm">
                <tbody>
                  <tr>
                    <td>Sub Total:</td>
                    <td className="text-end">
                      ₹
                      {subtotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>

                  {/* DYNAMIC TAX HANDLING */}
                  {invoiceData.gstBreakup?.type === "IGST" ? (
                    <>
                      <tr>
                        <td>IGST ({invoiceData.gstBreakup.igstRate}):</td>
                        <td className="text-end text-success">
                          ₹
                          {invoiceData.gstBreakup.igstAmount.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <td>CGST ({invoiceData.gstBreakup.cgstRate}):</td>
                        <td className="text-end text-success">
                          ₹
                          {invoiceData.gstBreakup.cgstAmount.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td>SGST ({invoiceData.gstBreakup.sgstRate}):</td>
                        <td className="text-end text-success">
                          ₹
                          {invoiceData.gstBreakup.sgstAmount.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>
                      </tr>
                    </>
                  )}

                  <tr>
                    <td>
                      Total Tax ({(invoiceData.taxRate * 100).toFixed(0)}%):
                    </td>
                    <td className="text-end text-success">
                      ₹
                      {invoiceData.gstBreakup?.totalTax.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>
                  </tr>

                  <tr className="border-top border-2">
                    <td>
                      <strong>Total Amount Due:</strong>
                    </td>
                    <td className="text-end">
                      <strong>
                        ₹
                        {invoiceData.totalAmount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="outline-primary" onClick={downloadPDF}>
          <Download className="lucide-icon me-2" /> Download PDF
        </Button>


      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;

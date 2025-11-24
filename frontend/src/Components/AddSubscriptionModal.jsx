import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  createSubscriptionAsync,
  updateSubscriptionAsync,
} from "../slices/subscriptionSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";

const AddSubscriptionModal = ({
  show,
  handleClose,
  mode = "add",
  planData,
}) => {
  const dispatch = useDispatch();

  const initialFormData = {
    planName: "",
    description: "",
    isFree: false,
    duration: "",
    accessLevel: "",
    emailSupport: false,
    adminApproval: false,
    pricingOptions: [
      {
        type: "Monthly",
        price: 0,
        features: [""],
        services: [
          {
            serviceName: "",
            subServices: [""],
          },
        ],
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (mode === "edit" && planData) {
      // Convert subServices from objects to strings for input
      const formattedPlan = {
        ...planData,
        pricingOptions: planData.pricingOptions.map((option) => ({
          ...option,
          services: option.services.map((service) => ({
            ...service,
            subServices: service.subServices.map((sub) => sub.name || sub),
          })),
        })),
      };
      setFormData(formattedPlan);
    } else {
      setFormData(initialFormData);
    }
  }, [mode, planData]);

  // General change for top-level fields
  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "isFree" && !checked) {
      setFormData((prev) => ({ ...prev, isFree: false, duration: "" }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Pricing option changes
  const handlePricingChange = (index, field, value) => {
    const options = [...formData.pricingOptions];
    options[index][field] = value;
    setFormData((prev) => ({ ...prev, pricingOptions: options }));
  };

  // Feature change
  const handleFeatureChange = (pIndex, fIndex, value) => {
    const options = [...formData.pricingOptions];
    options[pIndex].features[fIndex] = value;
    setFormData((prev) => ({ ...prev, pricingOptions: options }));
  };

  const addFeature = (pIndex) => {
    const options = [...formData.pricingOptions];
    options[pIndex].features.push("");
    setFormData((prev) => ({ ...prev, pricingOptions: options }));
  };

  const removeFeature = (pIndex, fIndex) => {
    const options = [...formData.pricingOptions];
    options[pIndex].features.splice(fIndex, 1);
    setFormData((prev) => ({ ...prev, pricingOptions: options }));
  };

  // Service change
  const handleServiceChange = (pIndex, sIndex, field, value) => {
    const options = [...formData.pricingOptions];
    options[pIndex].services[sIndex][field] = value;
    setFormData((prev) => ({ ...prev, pricingOptions: options }));
  };

  const addService = (pIndex) => {
    const options = [...formData.pricingOptions];
    options[pIndex].services.push({ serviceName: "", subServices: [""] });
    setFormData((prev) => ({ ...prev, pricingOptions: options }));
  };

  const removeService = (pIndex, sIndex) => {
    const options = [...formData.pricingOptions];
    options[pIndex].services.splice(sIndex, 1);
    setFormData((prev) => ({ ...prev, pricingOptions: options }));
  };

  // Subservice change
  //   const handleSubServiceChange = (pIndex, sIndex, subIndex, value) => {
  //     const options = [...formData.pricingOptions];
  //     options[pIndex].services[sIndex].subServices[subIndex] = value;
  //     setFormData((prev) => ({ ...prev, pricingOptions: options }));
  //   };
  // Subservice change
  const handleSubServiceChange = (pIndex, sIndex, subIndex, value) => {
    const options = [...formData.pricingOptions];
    options[pIndex].services[sIndex].subServices[subIndex] = value; // correct
    setFormData({ ...formData, pricingOptions: options });
  };

  const addSubService = (pIndex, sIndex) => {
    const options = [...formData.pricingOptions];
    options[pIndex].services[sIndex].subServices.push("");
    setFormData((prev) => ({ ...prev, pricingOptions: options }));
  };

  const removeSubService = (pIndex, sIndex, subIndex) => {
    const options = [...formData.pricingOptions];
    options[pIndex].services[sIndex].subServices.splice(subIndex, 1);
    setFormData((prev) => ({ ...prev, pricingOptions: options }));
  };
  //   const handleSubmit = async () => {
  //     try {
  //       // Convert subServices strings to objects
  //       const formattedPricingOptions = formData.pricingOptions.map((option) => ({
  //         ...option,
  //         services: option.services.map((service) => ({
  //           ...service,
  //           subServices: service.subServices.map((sub) => ({ name: sub })),
  //         })),
  //       }));

  //       await dispatch(
  //         createSubscriptionAsync({
  //           ...formData,
  //           pricingOptions: formattedPricingOptions,
  //         })
  //       ).unwrap();

  //       toast.success("Subscription Plan Added Successfully! 🎉");

  //       // Reset form
  //       setFormData(initialFormData);
  //       handleClose();
  //     } catch (error) {
  //       console.error("Error creating subscription:", error);
  //       toast.error(`Failed to add plan: ${error.message || "Unknown error"}`);
  //     }
  //   };

  const handleSubmit = async () => {
    try {
      const formattedPricingOptions = formData.pricingOptions.map((option) => ({
        ...option,
        services: option.services.map((service) => ({
          ...service,
          subServices: service.subServices.map((sub) => ({ name: sub })),
        })),
      }));

      if (mode === "add") {
        // await dispatch(
        //   createSubscriptionAsync({
        //     ...formData,
        //     pricingOptions: formattedPricingOptions,
        //   })
        // ).unwrap();
        await dispatch(
          createSubscriptionAsync({
            ...formData,
            duration: formData.duration ? `${formData.duration} Days` : "", // 👈 convert number → string
            pricingOptions: formattedPricingOptions,
          })
        ).unwrap();

        toast.success("Subscription Plan Added Successfully! 🎉");
      } else if (mode === "edit" && planData?._id) {
        await dispatch(
          updateSubscriptionAsync({
            id: planData._id,
            // planData: { ...formData, pricingOptions: formattedPricingOptions },
            planData: {
              ...formData,
              duration: formData.duration ? `${formData.duration} Days` : "",
              pricingOptions: formattedPricingOptions,
            },
          })
        ).unwrap();
      }

      handleClose();
      setFormData(initialFormData);
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "add"
            ? "Add New Subscription Plan"
            : "Edit Subscription Plan"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Label>Plan Name</Form.Label>
              {/* <Form.Control
                type="text"
                name="planName"
                value={formData.planName}
                onChange={handleChange}
              /> */}

              <Form.Select
                name="planName"
                value={formData.planName}
                onChange={handleChange}
              >
                <option value="">Select Plan</option>
                <option value="Trial">Trial</option>
                <option value="Trader">Trader</option>
                <option value="Investor">Investor</option>
                <option value="Trader Premium">Trader Premium</option>
                <option value="Extended Trial">Extended Trial</option>
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Check
                type="checkbox"
                label="Free Plan"
                name="isFree"
                checked={formData.isFree}
                onChange={handleChange}
              />
            </Col>
            <Col>
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
              />
            </Col>
          </Row>

          {/* Pricing Options */}
          {formData.pricingOptions.map((option, pIndex) => (
            <div key={pIndex} className="border p-3 mb-3">
              <Row className="mb-2">
                <Col>
                  <Form.Label>Option Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={option.type}
                    onChange={(e) =>
                      handlePricingChange(pIndex, "type", e.target.value)
                    }
                  >
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Yearly</option>
                    <option>Trial</option>
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={option.price}
                    onChange={(e) =>
                      handlePricingChange(pIndex, "price", e.target.value)
                    }
                  />
                </Col>
              </Row>

              {/* Features */}
              <h6>Features:</h6>
              {option.features.map((feature, fIndex) => (
                <InputGroup className="mb-2" key={fIndex}>
                  <Form.Control
                    value={feature}
                    onChange={(e) =>
                      handleFeatureChange(pIndex, fIndex, e.target.value)
                    }
                  />
                  <Button
                    variant="danger"
                    onClick={() => removeFeature(pIndex, fIndex)}
                  >
                    X
                  </Button>
                </InputGroup>
              ))}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => addFeature(pIndex)}
              >
                Add Feature
              </Button>

              {/* Services */}
              <h6 className="mt-3">Services:</h6>
              {option.services.map((service, sIndex) => (
                <div key={sIndex} className="border p-2 mb-2">
                  <Form.Label>Service Name</Form.Label>
                  <InputGroup className="mb-2">
                    <Form.Control
                      value={service.serviceName}
                      onChange={(e) =>
                        handleServiceChange(
                          pIndex,
                          sIndex,
                          "serviceName",
                          e.target.value
                        )
                      }
                    />
                    <Button
                      variant="danger"
                      onClick={() => removeService(pIndex, sIndex)}
                    >
                      X
                    </Button>
                  </InputGroup>

                  {/* Sub Services */}
                  <h6>Sub Services:</h6>
                  {service.subServices.map((sub, subIndex) => (
                    <InputGroup className="mb-2" key={subIndex}>
                      <Form.Control
                        value={sub}
                        onChange={(e) =>
                          handleSubServiceChange(
                            pIndex,
                            sIndex,
                            subIndex,
                            e.target.value
                          )
                        }
                      />
                      <Button
                        variant="danger"
                        onClick={() =>
                          removeSubService(pIndex, sIndex, subIndex)
                        }
                      >
                        X
                      </Button>
                    </InputGroup>
                  ))}
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => addSubService(pIndex, sIndex)}
                  >
                    Add Sub Service
                  </Button>
                </div>
              ))}
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => addService(pIndex)}
              >
                Add Service
              </Button>
            </div>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          {mode === "add" ? "Add Subscription" : "Update Subscription"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSubscriptionModal;

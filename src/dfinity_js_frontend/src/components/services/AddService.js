import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddService = ({save}) => {


    const [serviceType, setServiceType] = useState("");
    const [servicePlan, setServicePlan] = useState("");
    const [servicePrice, setServicePrice] = useState(0);
    const [connectionSpeed, setConnectionSpeed] = useState("");
    const [installationDate, setInstallationDate] = useState("");
    const [technicianName, setTechnicianName] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [billingCycle, setBillingCycle] = useState("");


    const isFormFilled = () => serviceType && servicePlan && connectionSpeed && installationDate && technicianName && paymentMethod && billingCycle;


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button
                onClick={handleShow}
                variant="dark"
                className="rounded-pill px-0"
                style={{ width: "38px", marginRight: "10px"}}
            >
                <i class="bi bi-wrench-adjustable"></i>
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Service</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicServiceType">
                            <Form.Label>Service Type</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Service Type"
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicServicePlan">
                            <Form.Label>Service Plan</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Service Plan"
                                value={servicePlan}
                                onChange={(e) => setServicePlan(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicServicePrice">
                            <Form.Label>Service Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Service Price"
                                value={servicePrice}
                                onChange={(e) => setServicePrice(e.target.value)}
                            />
                        </Form.Group>


                        <Form.Group className="mb-3" controlId="formBasicConnectionSpeed">
                            <Form.Label>Connection Speed</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Connection Speed"
                                value={connectionSpeed}
                                onChange={(e) => setConnectionSpeed(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicInstallationDate">
                            <Form.Label>Installation Date</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Enter Installation Date"
                                value={installationDate}
                                onChange={(e) => setInstallationDate(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicTechnicianName">
                            <Form.Label>Technician Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Technician Name"
                                value={technicianName}
                                onChange={(e) => setTechnicianName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPaymentMethod">
                            <Form.Label>Payment Method</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Payment Method"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicBillingCycle">
                            <Form.Label>Billing Cycle</Form.Label
                            >
                            <Form.Control
                                type="text"
                                placeholder="Enter Billing Cycle"
                                value={billingCycle}
                                onChange={(e) => setBillingCycle(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        disabled={!isFormFilled()}
                        onClick={() => {
                            save({serviceType, servicePlan,
                                servicePrice,
                                connectionSpeed, installationDate, technicianName, paymentMethod, billingCycle});
                            handleClose();
                        }}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddService
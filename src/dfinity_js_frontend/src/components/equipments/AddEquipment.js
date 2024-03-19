import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddEquipment = ({save}) => {

    const [equipmentType, setEquipmentType] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [macAddress, setMacAddress] = useState("");

    const isFormFilled = () => equipmentType && serialNumber && macAddress;


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button
                onClick={handleShow}
                variant="dark"
                className="rounded-pill px-0"
                style={{ width: "38px" }}
            >
                <i class="bi bi-boxes"></i>
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Equipment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEquipmentType">
                            <Form.Label>Equipment Type</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Equipment Type"
                                value={equipmentType}
                                onChange={(e) => setEquipmentType(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicSerialNumber">
                            <Form.Label>Serial Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Serial Number"
                                value={serialNumber}
                                onChange={(e) => setSerialNumber(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicMacAddress">
                            <Form.Label>Mac Address</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Mac Address"
                                value={macAddress}
                                onChange={(e) => setMacAddress(e.target.value)}
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
                            save({equipmentType, serialNumber, macAddress});
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

export default AddEquipment
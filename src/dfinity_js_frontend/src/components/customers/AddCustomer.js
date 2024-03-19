import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddCustomer = ({save}) => {

    const [fullName, setFullName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [residentialAddress, setResidentialAddress] = useState("");
    const [billingAddress, setBillingAddress] = useState("");
    const [idDocumentType, setIdDocumentType] = useState("");
    const [idDocumentNumber, setIdDocumentNumber] = useState("");

    const isFormFilled = () => fullName && emailAddress && contactNumber && residentialAddress && billingAddress && idDocumentType && idDocumentNumber;



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
        <i class="bi bi-person-circle"></i>
        </Button>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicFullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmailAddress">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter Email Address"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicContactNumber">
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Contact Number"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicResidentialAddress">
                        <Form.Label>Residential Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Residential Address"
                            value={residentialAddress}
                            onChange={(e) => setResidentialAddress(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicBillingAddress">
                        <Form.Label>Billing Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Billing Address"
                            value={billingAddress}
                            onChange={(e) => setBillingAddress(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicIdDocumentType">
                        <Form.Label>ID Document Type</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter ID Document Type"
                            value={idDocumentType}
                            onChange={(e) => setIdDocumentType(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicIdDocumentNumber">
                        <Form.Label>ID Document Number</Form.Label>
                        < Form.Control
                            type="text"
                            placeholder="Enter ID Document Number"
                            value={idDocumentNumber}
                            onChange={(e) => setIdDocumentNumber(e.target.value)}
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
                        save({
                            fullName,
                            emailAddress,
                            contactNumber,
                            residentialAddress,
                            billingAddress,
                            idDocumentType,
                            idDocumentNumber,
                        });
                        handleClose();
                    } }
                >
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
       </>
    )
}



export default AddCustomer
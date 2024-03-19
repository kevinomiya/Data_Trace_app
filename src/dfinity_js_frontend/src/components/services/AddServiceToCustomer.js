import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddServiceToCustomer = ({save}) => {
    const [serviceId, setServiceId] = useState("");

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


  return (
    <>
        <Button
            onClick={handleShow}
            variant="dark"
            style={{  marginTop: "10px", marginBottom: "10px"}}
        >
            Insert Service
        </Button>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Service to Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicServiceId">
                        <Form.Label>Service Id</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Service Id"
                            value={serviceId}
                            onChange={(e) => setServiceId(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={()=> {
                        save(serviceId);
                        handleClose();
                    }}>
                        Insert Service
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    </>
  )
}

export default AddServiceToCustomer
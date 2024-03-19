import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
const AddEquipmentToService = ({save}) => {
    const[equipmentId, setEquipmentId] = useState("");

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

  return (
    <>
        <Button
            onClick={handleShow}
            variant="dark"
      
        >
            Insert Equipment
        </Button>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Equipment to Service</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEquipmentId">
                        <Form.Label>Equipment Id</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Equipment Id"
                            value={equipmentId}
                            onChange={(e) => setEquipmentId(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={()=> {
                        save(equipmentId);
                        handleClose();
                    }}>
                        Insert Equipment
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    </>
        
  )
}

export default AddEquipmentToService
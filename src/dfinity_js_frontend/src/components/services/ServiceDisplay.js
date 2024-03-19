import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Badge, Row  } from "react-bootstrap";
import { toast } from "react-toastify";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import { addEquipmentToService } from "../../utils/dataTrace";
import AddEquipmentToService from "../equipments/AddEquipmentToService";


const ServiceDisplay = ({service}) => {
 
    const { id, serviceType, servicePlan, connectionSpeed, equipments,
        installationDate, technicianName, paymentMethod, 
        billingCycle } = service;

    const [loading, setLoading] = useState(false);
    console.log("serice",service)
    console.log("equipments",equipments);


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
                <i class="bi bi-wrench-adjustable"></i>
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Service Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Service Type: {serviceType}</p>
                    <p>Service Plan: {servicePlan}</p>
                    <p>Connection Speed: {connectionSpeed}</p>
                    <p>Installation Date: {installationDate}</p>
                    <p>Technician Name: {technicianName}</p>
                    <p>Payment Method: {paymentMethod}</p>
                    <p>Billing Cycle: {billingCycle}</p>

                    {/* Badges with list of equipments */}
                    <>
                    <p>Equipments:</p>
                    {equipments.map((equipment,index) => (
                        <Badge bg="secondary" style={{marginLeft: "10px"}} key={index}>{equipment.equipmentType}</Badge>
                    ))}
                    </>
    

                </Modal.Body>
            </Modal>
        </>
    );

}

export default ServiceDisplay
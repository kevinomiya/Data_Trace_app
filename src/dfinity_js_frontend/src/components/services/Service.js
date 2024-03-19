import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Card, Button, Col, Badge, Stack, Row } from "react-bootstrap";
import AddEquipmentToService from "../equipments/AddEquipmentToService";
import { addEquipmentToService } from "../../utils/dataTrace";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";

const Service = ({service}) => {

    const { id, serviceType, servicePlan, connectionSpeed,
         installationDate, technicianName, 
         paymentMethod, billingCycle } = service;

    const [loading, setLoading] = useState(false);

        const handleInsertEquipment = (equipmentId) => {
        try {
            setLoading(true);
            addEquipmentToService(id,equipmentId).then((resp) => {
                console.log(resp)
            });
            toast(<NotificationSuccess text="Equipment added successfully." />);
        
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Failed to add equipment." />);
        }
    }

    return (
        <>
            <Card>
                <Card.Header>
                    <Badge bg="primary">Service ID: {id}</Badge>
                    <Card.Title>{serviceType}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        <Row>
                            <Col>
                                <p>Service Plan: {servicePlan}</p>
                                <p>Connection Speed: {connectionSpeed}</p>
                                <p>Installation Date: {installationDate}</p>
                                <p>Technician Name: {technicianName}</p>
                                <p>Payment Method: {paymentMethod}</p>
                                <p>Billing Cycle: {billingCycle}</p>
                            </Col>
                        </Row>
                        <Row className="d-flex justify-content-end">
                            <AddEquipmentToService save={handleInsertEquipment} />
                        </Row>
                    </Card.Text>
                </Card.Body>
            </Card>
        
        </>
    )
}

export default Service
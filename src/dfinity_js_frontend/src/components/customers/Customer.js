import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Card, Button, Col, Badge, Stack, Row } from "react-bootstrap";
import ServiceDisplay from "../services/ServiceDisplay";
import AddServiceToCustomer from "../services/AddServiceToCustomer";
import { addServiceToCustomer, payService } from "../../utils/dataTrace";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";


const Customer = ({ customer }) => {

    const { id, fullName, emailAddress, contactNumber, residentialAddress,
        billingAddress,
        idDocumentType, idDocumentNumber, service} = customer;

        const [loading, setLoading] = useState(false);



        const handleInsertService = (serviceId) => {
            try {
                setLoading(true);
                addServiceToCustomer(id,serviceId).then((resp) => {
                    console.log(resp)
                });
                toast(<NotificationSuccess text="Service added successfully." />);
            
            } catch (error) {
                console.log({ error });
                toast(<NotificationError text="Failed to add Service." />);
            }
        }

        const pay = async () => {
            try {
              setLoading(true);
              await payService({
                id
              }).then((resp) => {
                toast(<NotificationSuccess text="Pay Accomplished successfully" />);
              });
            } catch (error) {
                console.log(error)
              toast(<NotificationError text="Failed to accomplish Pay. Add Service to make Pay" />);
            } finally {
              setLoading(false);
            }
          };
      
    return (
        <Card>
            <Card.Header>
                <Badge bg="primary">Customer ID: {id}</Badge>
                <Card.Title>{fullName}</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    <Row>
                        <Col>
                            <p>Email Address: {emailAddress}</p>
                            <p>Contact Number: {contactNumber}</p>
                            <p>Residential Address: {residentialAddress}</p>
                            <p>Billing Address: {billingAddress}</p>
                            <p>ID Document Type: {idDocumentType}</p>
                            <p>ID Document Number: {idDocumentNumber}</p>
                        </Col>
                    </Row>
                    <Row className="d-flex justify-content-between">
                        <ServiceDisplay service={service} />
                        <AddServiceToCustomer save={handleInsertService} />
                    </Row>
                    <Row>
                        {/* Implement this at the end */}
                        <Button variant="danger" size="sm"
                            onClick={() => {
                                pay()
                            } }
                        
                        >Pay Service</Button>
                    </Row>
                </Card.Text>
            </Card.Body>
        </Card>
    
    )
}

export default Customer
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Card, Button, Col, Badge, Stack, Row } from "react-bootstrap";

const Equipment = ({equipment}) => {

    const { id, equipmentType, serialNumber, macAddress } = equipment;
    return (
        <>
            <Card>
                <Card.Header>
                    <Badge bg="primary">Equipment ID: {id}</Badge>
                    <Card.Title>{equipmentType}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        <Row>
                            <Col>
                                <p>Serial Number: {serialNumber}</p>
                                <p>MAC Address: {macAddress}</p>
                            </Col>
                        </Row>
                    </Card.Text>
                </Card.Body>
            </Card>
        
        </>
    )
}

export default Equipment
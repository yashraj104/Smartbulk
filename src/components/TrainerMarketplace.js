import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";

function TrainerMarketplace() {
  const trainers = [
    { name: "Alex Strong", specialty: "Strength Training" },
    { name: "Mia Flex", specialty: "Yoga & Flexibility" },
    { name: "Jake Speed", specialty: "Cardio & Endurance" },
  ];

  return (
    <div>
      <h2 className="mb-4">Trainer Marketplace</h2>
      <Row>
        {trainers.map((t, idx) => (
          <Col md={4} key={idx}>
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>{t.name}</Card.Title>
                <Card.Text>{t.specialty}</Card.Text>
                <Button variant="primary">View Profile</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default TrainerMarketplace;

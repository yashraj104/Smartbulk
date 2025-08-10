import React from "react";
import { Card, Row, Col } from "react-bootstrap";

function ExerciseLibrary() {
  const exercises = [
    { name: "Push-Up", description: "A bodyweight exercise for chest and triceps." },
    { name: "Pull-Up", description: "Targets back and biceps using your bodyweight." },
    { name: "Squat", description: "Works your legs and core strength." },
  ];

  return (
    <div>
      <h2 className="mb-4">Exercise Library</h2>
      <Row>
        {exercises.map((ex, idx) => (
          <Col md={4} key={idx}>
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>{ex.name}</Card.Title>
                <Card.Text>{ex.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ExerciseLibrary;

import React from "react";
import { ListGroup, Badge } from "react-bootstrap";

function Challenges() {
  const challenges = [
    { name: "30-Day Push-Up Challenge", progress: "15/30 days" },
    { name: "Run 50km in a Month", progress: "35/50 km" },
    { name: "No Sugar Week", progress: "3/7 days" },
  ];

  return (
    <div>
      <h2 className="mb-4">Challenges</h2>
      <ListGroup>
        {challenges.map((c, idx) => (
          <ListGroup.Item key={idx}>
            {c.name}
            <Badge bg="info" className="float-end">
              {c.progress}
            </Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default Challenges;

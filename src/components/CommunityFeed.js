import React from "react";
import { Card } from "react-bootstrap";

function CommunityFeed() {
  const posts = [
    { user: "JohnD", message: "Hit a new PR on deadlifts today!" },
    { user: "FitSarah", message: "Meal prep done for the week!" },
    { user: "MikeLifts", message: "Joined the 100kg bench club 💪" },
  ];

  return (
    <div>
      <h2 className="mb-4">Community Feed</h2>
      {posts.map((post, idx) => (
        <Card key={idx} className="mb-2 shadow-sm">
          <Card.Body>
            <strong>{post.user}</strong>: {post.message}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default CommunityFeed;

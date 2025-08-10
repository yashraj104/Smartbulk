import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

function AIChatCoach() {
  const [messages, setMessages] = useState([
    { sender: "AI", text: "Hi! How’s your training going today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "You", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: "Nice! Keep up the great work 💪" },
      ]);
    }, 500);
  };

  return (
    <div>
      <h2 className="mb-4">AI Chat Coach</h2>
      <Card className="shadow-sm p-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
        {messages.map((m, idx) => (
          <p key={idx}>
            <strong>{m.sender}:</strong> {m.text}
          </p>
        ))}
      </Card>
      <Form className="mt-3 d-flex">
        <Form.Control
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button variant="primary" className="ms-2" onClick={sendMessage}>
          Send
        </Button>
      </Form>
    </div>
  );
}

export default AIChatCoach;

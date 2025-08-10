import React from 'react';
import { Spinner } from 'react-bootstrap';

function Loading({ size = "md", text = "Loading..." }) {
  const spinnerSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "";
  
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" role="status" variant="warning" size={spinnerSize} className="mb-3">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="text-muted fw-medium">{text}</p>
    </div>
  );
}

export default Loading;

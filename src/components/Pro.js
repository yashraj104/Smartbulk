import React from "react";
import { Link } from "react-router-dom";

export default function Pro(){
  return (
    <div className="card p-4 shadow-sm text-center">
      <h2>SmartBulk Pro</h2>
      <p className="lead">Upgrade for advanced plans, PDFs, grocery lists, AI features and trainer marketplace priority.</p>
      <Link to="/payment" className="btn btn-warning">Support on Ko-fi / Unlock Pro</Link>

      <div className="row mt-4">
        <div className="col-md-4"><div className="card p-3">Advanced PDF plans</div></div>
        <div className="col-md-4"><div className="card p-3">AI Form Checker (coming)</div></div>
        <div className="col-md-4"><div className="card p-3">Priority trainer matches</div></div>
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";

export default function Payment(){
  const nav = useNavigate();
  const unlock = () => {
    localStorage.setItem("proUnlocked", "true");
    nav("/result");
  };

  return (
    <div className="card p-4 text-center">
      <h3>Support SmartBulk</h3>
      <p className="mb-3">Support on Ko-fi to unlock Pro features and the detailed PDF plan.</p>
      <a href="https://ko-fi.com/yashrajshinde" target="_blank" rel="noreferrer" onClick={unlock}>
        <img src="https://storage.ko-fi.com/cdn/kofi2.png?v=3" height="50" alt="Ko-fi"/>
      </a>
      <p className="mt-3 text-muted">After supporting, return here to download the Pro plan.</p>
    </div>
  );
}

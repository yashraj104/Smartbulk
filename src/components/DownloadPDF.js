import React from "react";
import { jsPDF } from "jspdf";

export default function DownloadPDF({ data }){
  const download = () => {
    const doc = new jsPDF({unit:'pt'});
    doc.setFontSize(18);
    doc.text("SmartBulk Pro Plan", 40, 60);
    doc.setFontSize(12);
    const lines = [
      `Name: ${data.input?.name || "-"}`,
      `Goal: ${data.input?.goal || "-"}`,
      `Weight: ${data.input?.weight || "-"}`,
      `Height: ${data.input?.height || "-"}`,
      "",
      "Sample 7-day plan:",
      "Day 1: Push — Bench, Shoulder, Triceps",
      "Day 2: Pull — Rows, Pull-ups, Biceps",
      "Day 3: Legs — Squats, Deadlifts",
      "",
      `Calories: ${data.diet?.calories || '-'}`,
      `Protein: ${data.diet?.protein || '-'} g`,
      "",
      "Grocery: Oats, Eggs, Milk, Rice, Paneer, Chicken, Vegetables"
    ];
    doc.text(lines, 40, 90);
    doc.save("SmartBulk_Pro_Plan.pdf");
  };

  return <button className="btn btn-success" onClick={download}>Download Pro PDF</button>;
}

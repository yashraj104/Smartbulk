import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DownloadPDF from "./DownloadPDF";

export default function PlanResult(){
  const [input, setInput] = useState(null);
  const [diet, setDiet] = useState(null);
  const [pro, setPro] = useState(false);

  useEffect(() => {
    setInput(JSON.parse(localStorage.getItem("smartbulk_plan_input")));
    setDiet(JSON.parse(localStorage.getItem("smartbulk_diet_input")));
    setPro(localStorage.getItem("proUnlocked") === "true");
  }, []);

  if(!input && !diet){
    return (
      <div className="text-center">
        <p>No plan found. Create a workout or diet plan first.</p>
        <Link to="/workout" className="btn btn-primary">Create Plan</Link>
      </div>
    );
  }

  const freeWorkout = () => {
    const days = Number(input?.days || 4);
    if(days <= 3) return ["Full Body (3x/week) — squats, pushups, rows"];
    if(days === 4) return ["Upper / Lower split — push/pull/legs/core"];
    return ["Push, Pull, Legs, Full, Core as sample split"];
  };

  const dietSummary = () => {
    const w = Number(diet?.weight || input?.weight || 70);
    const cal = Math.round(w * (input?.goal === "bulk" ? 35 : 28));
    return { calories: cal, protein: Math.round(w * 2.0) };
  };

  const workout = freeWorkout();
  const dietS = dietSummary();

  return (
    <div className="card p-4 shadow-sm">
      <h3>Your Free Plan Preview</h3>

      {input && (
        <>
          <h5 className="mt-3">Workout ({input.goal})</h5>
          {workout.map((w,i)=>(
            <div className="card mb-2 p-2" key={i}>{w}</div>
          ))}
        </>
      )}

      {diet && (
        <>
          <h5 className="mt-3">Diet Summary</h5>
          <p>Estimated Calories/day: <strong>{dietS.calories}</strong></p>
          <p>Protein target/day: <strong>{dietS.protein} g</strong></p>
        </>
      )}

      <div className="mt-4">
        <button className="btn btn-secondary me-2" onClick={() => {
          // generate a quick free TXT
          const blob = new Blob([`SmartBulk Free Plan\n\nWorkout:\n${workout.join("\n")}\n\nDiet:\nCalories: ${dietS.calories}\nProtein: ${dietS.protein}g`], {type:'text/plain'});
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'SmartBulk_FreePlan.txt';
          link.click();
        }}>Download Free Summary</button>

        {!pro ? (
          <Link to="/payment" className="btn btn-warning">Unlock Pro PDF</Link>
        ) : (
          <div className="d-inline-block ms-2"><DownloadPDF data={{ input, diet: dietS }} /></div>
        )}
      </div>
    </div>
  );
}

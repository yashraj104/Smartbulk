import React from "react";
import { Card } from "react-bootstrap";

function MacroCalculator() {
  const macros = { protein: 150, carbs: 200, fats: 70 };

  return (
    <div>
      <h2 className="mb-4">Macro Calculator</h2>
      <Card className="shadow-sm p-3">
        <h5>Daily Targets</h5>
        <p>Protein: {macros.protein}g</p>
        <p>Carbs: {macros.carbs}g</p>
        <p>Fats: {macros.fats}g</p>
      </Card>
    </div>
  );
}

export default MacroCalculator;

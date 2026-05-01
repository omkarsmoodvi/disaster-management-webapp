import React from "react";
export default function NavigationPanel({ steps }) {
  if (!steps || steps.length === 0) return null;
  return (
    <div style={{margin:"16px 0 0 0",padding: "16px", background: "#f6fafe", borderRadius:8}}>
      <b>Step-by-step Directions</b>
      <ol>
        {steps.map((step, idx) => (
          <li key={idx} style={{marginBottom:4}}>
            {step.maneuver.instruction}
          </li>
        ))}
      </ol>
    </div>
  );
}

import React from "react";
const PlaceList = ({ places, onPlaceClick, selectedId }) => (
  <ul style={{ listStyle: "none", padding: 0 }}>
    {places.map(place => (
      <li
        key={place._id}
        style={{
          background: place._id === selectedId ? "#bee3f8" : "#fff",
          margin: "8px 0",
          padding: "10px",
          borderRadius: "4px",
          cursor: "pointer",
          boxShadow: place._id === selectedId ? "0 2px 8px #6662" : "none"
        }}
        onClick={() => onPlaceClick(place)}
      >
        <strong>{place.name}</strong><br/>
        <span style={{fontSize: "90%",color:"#555"}}>{place.type} — {place.address}</span>
      </li>
    ))}
  </ul>
);
export default PlaceList;

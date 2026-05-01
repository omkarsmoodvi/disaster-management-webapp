import React, { useState } from "react";
export default function SearchBar({ onSelect, placeholder }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const handleSearch = async e => {
    setQuery(e.target.value);
    if (e.target.value.length < 3) return setResults([]);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(e.target.value)}`;
    const res = await fetch(url);
    const data = await res.json();
    setResults(data);
  };
  return (
    <div style={{ position: "relative", margin: "8px 0" }}>
      <input
        value={query}
        onChange={handleSearch}
        placeholder={placeholder || "Search address or place"}
        style={{ width: "100%", padding: 8, fontSize: 16 }}
      />
      {results.length > 0 && (
        <ul
          style={{
            position: "absolute",
            zIndex: 1000,
            top: 36,
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #ddd",
            maxHeight: 200,
            overflow: "auto",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {results.map(r => (
            <li
              key={r.place_id}
              style={{ padding: 8, cursor: "pointer" }}
              onClick={() => {
                onSelect([
                  parseFloat(r.lat),
                  parseFloat(r.lon)
                ], r.display_name);
                setQuery(r.display_name);
                setResults([]);
              }}
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

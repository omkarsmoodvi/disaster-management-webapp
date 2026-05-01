import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/chat"; // Change if backend is a different URL

export default function Chatbot() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendQuestion = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setHistory(h =>
      [...h, { from: "user", text: input }]
    );
    try {
      const res = await axios.post(API_URL, { question: input });
      setHistory(h =>
        [...h, { from: "bot", text: res.data.answer }]
      );
    } catch {
      setHistory(h =>
        [...h, { from: "bot", text: "Server error. Please try again later." }]
      );
    }
    setInput("");
    setLoading(false);
  };

  return (
    <div style={{
      border: "1.5px solid #674ea7",
      borderRadius: 18,
      background: "#fafaff",
      maxWidth: 440,
      margin: "40px auto",
      padding: "24px 14px"
    }}>
      <h3 style={{color:"#5e1b90"}}>Disaster Help Chatbot</h3>
      <div style={{
        minHeight: 200, maxHeight: 340, overflowY: "auto", background: "#fff", padding: 10,
        marginBottom: 14, borderRadius: 8, fontSize: "1.05rem"
      }}>
        {history.map((msg, i) =>
          <div key={i} style={{
            textAlign: msg.from === "user" ? "right" : "left",
            marginBottom: 7
          }}>
            <span style={{background: msg.from === "user" ? "#e3e4fd" : "#e2ffe7",
                          padding: "4px 12px", borderRadius: 8, display:"inline-block"}}>
              {msg.from === "user" ? "You: " : "Bot: "}
              {msg.text}
            </span>
          </div>
        )}
      </div>
      <div style={{display:"flex", gap:6}}>
        <input
          style={{flex:1, padding: "8px 12px", borderRadius: 8, border: "1.2px solid #ccc"}}
          placeholder="Type your question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendQuestion(); }}
          disabled={loading}
        />
        <button onClick={sendQuestion} disabled={loading || !input.trim()} style={{
          borderRadius: 8, background: "#6c52ae", color: "#fff", fontWeight:"bold", border: "none", padding: "0 18px"
        }}>Send</button>
      </div>
      <div style={{marginTop:10, fontSize:"0.92rem", color:"#888"}}>Try: "ambulance number", "how to help in flood"</div>
    </div>
  );
}

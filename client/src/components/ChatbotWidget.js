import React, { useState } from "react";

const CHATBOT_URL = "http://localhost:5000"; // Or use your server IP if needed

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Icon/Button */}
      <div
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          zIndex: 1000,
          background: "#3d5af1",
          width: 60,
          height: 60,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          cursor: "pointer",
          boxShadow: "0px 2px 16px rgba(60,60,100,0.15)",
          fontSize: 32,
        }}
        title="Open Disaster Management Chatbot"
      >
        💬
      </div>

      {/* Modal/Popup with Iframe */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(60,60,80,0.19)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "10px",
              boxShadow: "0 8px 32px rgba(0,0,60,0.19)",
              width: 500,
              maxWidth: "96vw",
              height: 600,
              maxHeight: "85vh",
              overflow: "hidden",
              position: "relative"
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={{
                position: "absolute",
                top: 6,
                right: 12,
                background: "transparent",
                border: "none",
                fontSize: 20,
                color: "#888",
                cursor: "pointer",
              }}
              onClick={() => setOpen(false)}
              aria-label="Close Chatbot"
              title="Close"
            >
              ×
            </button>
            <iframe
              src={CHATBOT_URL}
              title="Disaster Management Chatbot"
              style={{
                width: "100%",
                height: "100%",
                border: "none"
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

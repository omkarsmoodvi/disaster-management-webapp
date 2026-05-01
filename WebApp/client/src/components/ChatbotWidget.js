import React, { useState, useRef, useEffect } from "react";

const CHATBOT_API_URL = "http://127.0.0.1:8000/chat";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (open && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [chat, open]);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question) return;
    setChat(prev => [...prev, { user: question }]);
    setLoading(true);
    setInput("");
    try {
      const res = await fetch(CHATBOT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      setChat(prev => [...prev, { bot: data.answer }]);
    } catch (e) {
      setChat(prev => [...prev, { bot: "Sorry, I'm unable to respond right now." }]);
    }
    setLoading(false);
  };

  const handleKey = e => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          zIndex: 2000,
          background: "linear-gradient(90deg,#a8caff,#f7d6fd)",
          width: 62,
          height: 62,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 18px rgba(100,120,190,0.16)",
          color: "#fff",
          fontSize: 28,
          cursor: "pointer"
        }}
        title="Open Chatbot"
      >
        💬
      </div>
      {/* Chat Modal */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(210,210,240,0.19)",
            zIndex: 2100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: "linear-gradient(120deg,#eaf5ff,#fff4fc 90%)",
              borderRadius: 24,
              width: 500,
              maxWidth: "99vw",
              height: 650,
              maxHeight: "98vh",
              boxShadow: "0 8px 32px rgba(80,100,170,0.17)",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              border: "1.3px solid #e2e8f0"
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute",
                top: 14,
                right: 24,
                background: "#fff0",
                border: "none",
                fontSize: 27,
                color: "#a3a3c2",
                cursor: "pointer",
                zIndex: 2
              }}
              title="Close chat">
              ×
            </button>
            {/* Chat History */}
            <div
              ref={ref}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "38px 34px 24px 34px",
                background: "#fcfcff",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                fontSize: "1.13em",
                wordBreak: "break-word"
              }}
            >
              {chat.length === 0 ? (
                <div style={{ color: "#9ab8ce", textAlign: "center", fontSize: 18, marginTop: 55 }}>
                  Need help? Ask about any disaster or emergency.<br />
                  I can guide you step-by-step!
                </div>
              ) : (
                chat.map((msg, i) =>
                  msg.user ? (
                    <div key={i} style={{ textAlign: "right", margin: "15px 0" }}>
                      <span style={{
                        background: "linear-gradient(90deg,#b3e5fc,#c9b6f7 90%)",
                        padding: "17px 32px",
                        borderRadius: 26,
                        display: "inline-block",
                        color: "#233",
                        fontSize: "1.18em",
                        boxShadow: "0 1px 8px rgba(130,150,210,0.06)"
                      }}>{msg.user}</span>
                    </div>
                  ) : (
                    <div key={i} style={{ textAlign: "left", margin: "16px 0 4px 0" }}>
                      <span style={{
                        background: "#ffeecf",
                        padding: "17px 32px",
                        borderRadius: 26,
                        display: "inline-block",
                        color: "#784800",
                        fontSize: "1.14em",
                        boxShadow: "0 2px 8px rgba(220,180,120,0.10)"
                      }}>
                        {/* Bullet splitting for vertical gap: double newlines after bullets */}
                        {msg.bot ? msg.bot.split(/\n\n|\r\n\r\n/).map((s, idx) => (
                          <span key={idx} style={{ display: "block", marginBottom: 16 }}>{s.trim()}</span>
                        )) : ""}
                      </span>
                    </div>
                  )
                )
              )}
              {loading && (
                <div style={{ color: "#666", fontSize: 15, marginTop: 18, textAlign: "left" }}>Bot is typing…</div>
              )}
            </div>
            {/* Input Bar */}
            <div style={{
              flexShrink: 0,
              padding: "19px 26px 21px 26px",
              background: "#f2f9fc",
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
              borderTop: "1px solid #e6ebfa",
              display: "flex"
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  borderRadius: "22px",
                  border: "1px solid #cae6fc",
                  background: "linear-gradient(90deg,#f8fafc,#eefcff 80%)",
                  marginRight: 14,
                  outline: "none",
                  fontSize: "1.15em",
                  color: "#2f446e"
                }}
                placeholder="Type your question…"
                autoFocus
              />
              <button
                onClick={sendMessage}
                disabled={loading || input.trim() === ""}
                style={{
                  background: "linear-gradient(90deg,#b2cafe,#d5aaff 85%)",
                  color: "#343363",
                  padding: "14px 20px",
                  border: "none",
                  borderRadius: "22px",
                  fontWeight: 600,
                  fontSize: "1.12em",
                  boxShadow: "0px 2px 6px rgba(100,145,205,0.10)",
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

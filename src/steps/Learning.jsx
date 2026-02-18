import { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import { btn, colors } from "../styles";
import ReactMarkdown from "react-markdown";

const RULES = [
  "Fill each cell with a number from 1 to 6.",
  "Each row, column, and 2×3 box must contain each number exactly once.",
  "Cells grouped in a cage must sum to the number in the cage's top-left corner.",
  "No number may repeat within a cage, even if the row/column allows it.",
];

function Rules() {
  return (
    <div style={{ background: "#eef3fb", borderRadius: 10, padding: "20px 24px", marginBottom: 32 }}>
      <h2 style={{ marginTop: 0, color: colors.primary }}>Killer Sudoku Rules</h2>
      <ol style={{ paddingLeft: 20, lineHeight: 2, color: colors.text, margin: 0 }}>
        {RULES.map((rule, i) => <li key={i}>{rule}</li>)}
      </ol>
    </div>
  );
}

function Control({ nextStep }) {
  return (
    <>
      <Rules />
      <button onClick={nextStep} style={btn.primary}>I'm ready to solve the puzzle</button>
    </>
  );
}

function Video({ nextStep }) {
  return (
    <>
      <Rules />
      <h2>Tutorial Video</h2>
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 10, overflow: "hidden", marginBottom: 32 }}>
        <iframe
          src="https://www.youtube.com/embed/FHHAK-CWnm4"
          title="Killer Sudoku Tutorial"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
        />
      </div>
      <button onClick={nextStep} style={btn.primary}>I'm ready to solve the puzzle</button>
    </>
  );
}

function AITutor({ nextStep }) {
  const [messages, setMessages] = useState([
    {
        role: "assistant",
        content: "Hi! I'm your Killer Sudoku tutor. I'm here to help you learn the rules and tricks of Killer Sudoku. Open up the practice puzzle in a new tab, and I'm here to help!",
      },
    ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <Rules />
      <h2>AI Tutor</h2>
      <p style={{ color: colors.textSecondary, marginBottom: 16 }}>
        Ask the tutor any questions about Killer Sudoku. When you feel ready, click the button below to start the puzzle.
      </p>

      {/* Chat window */}
      <div style={{
        border: `1px solid ${colors.border}`,
        borderRadius: 10,
        height: 360,
        overflowY: "auto",
        padding: 16,
        backgroundColor: "#fff",
        marginBottom: 12,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}>
        {messages.length === 0 && (
          <p style={{ color: "#aaa", margin: "auto", textAlign: "center" }}>
            Ask a question to get started.
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            backgroundColor: msg.role === "user" ? colors.primary : "#f0f0f0",
            color: msg.role === "user" ? "#fff" : colors.text,
            padding: "10px 14px",
            borderRadius: 10,
            maxWidth: "80%",
            lineHeight: 1.5,
            fontSize: 15,
          }}>
		<ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}
        {loading && (
          <div style={{
            alignSelf: "flex-start",
            backgroundColor: "#f0f0f0",
            color: "#aaa",
            padding: "10px 14px",
            borderRadius: 10,
            fontSize: 15,
          }}>
            Thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          style={{
            flex: 1,
            padding: "9px 12px",
            fontSize: 15,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            color: colors.text,
            backgroundColor: "#fff",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          style={input.trim() && !loading ? btn.primary : btn.disabled}
        >
          Send
        </button>
      </div>

      <button onClick={nextStep} style={{ ...btn.primary, backgroundColor: "#1a1a1a" }}>
        I'm ready to solve the puzzle
      </button>
    </>
  );
}

export default function Learning({ nextStep, group, currentStep }) {
  return (
    <Layout currentStep={currentStep}>
      <h1 style={{ marginTop: 0 }}>Learn Killer Sudoku</h1>
      {group === "control" && <Control nextStep={nextStep} />}
      {group === "video" && <Video nextStep={nextStep} />}
      {group === "ai" && <AITutor nextStep={nextStep} />}
    </Layout>
  );
}

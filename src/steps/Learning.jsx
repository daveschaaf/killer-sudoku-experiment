import { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import KillerSudokuGrid from "../components/KillerSudokuGrid";
import { btn, colors } from "../styles";
import ReactMarkdown from "react-markdown";
import puzzle1 from "../puzzles/puzzle1.json";

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

function DoneSection({ nextStep }) {
  return (
    <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 32, marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
      <button onClick={nextStep} style={btn.primary}>
        I'm Done →
      </button>
    </div>
  );
}

function Control({ onDone }) {
  const [actions, setActions] = useState(0);
  const gridRef = useRef(null);
  return (
    <>
      <Rules />
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ marginTop: 0 }}>Practice Puzzle</h2>
        <p style={{ color: colors.textSecondary, lineHeight: 1.7, marginBottom: 20 }}>
          Try solving this practice puzzle to get familiar with the rules. There's no time pressure
          and no right or wrong outcome — just explore. Click a cell to select it, then use the
          numpad or your keyboard to enter a number.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <KillerSudokuGrid ref={gridRef} puzzle={puzzle1} showTimer={false} showGiveUp={false} onAction={() => setActions((n) => n + 1)} />
        </div>
      </div>
      <DoneSection nextStep={() => onDone(actions, gridRef.current?.getElapsed() ?? 0)} />
    </>
  );
}

function Video({ onDone }) {
  const [actions, setActions] = useState(0);
  const gridRef = useRef(null);
  return (
    <>
      <Rules />
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ marginTop: 0 }}>Tutorial Video</h2>
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 10, overflow: "hidden" }}>
          <iframe
            src="https://www.youtube.com/embed/FHHAK-CWnm4"
            title="Killer Sudoku Tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>
      </div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ marginTop: 0 }}>Practice Puzzle</h2>
        <p style={{ color: colors.textSecondary, lineHeight: 1.7, marginBottom: 20 }}>
          Try solving this practice puzzle to get familiar with the rules. There's no time pressure
          and no right or wrong outcome — just explore. Click a cell to select it, then use the
          numpad or your keyboard to enter a number.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <KillerSudokuGrid ref={gridRef} puzzle={puzzle1} showTimer={false} showGiveUp={false} onAction={() => setActions((n) => n + 1)} />
        </div>
      </div>
      <DoneSection nextStep={() => onDone(actions, gridRef.current?.getElapsed() ?? 0)} />
    </>
  );
}

function AITutor({ onDone }) {
  const [actions, setActions] = useState(0);
  const gridRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your Killer Sudoku tutor. I'm here to help you learn the rules and tricks of Killer Sudoku. Try the practice puzzle above, and ask me anything!",
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
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>AI Tutor</h2>
        <p style={{ color: colors.textSecondary, marginBottom: 16 }}>
          Ask the tutor any questions about Killer Sudoku while you work through the practice puzzle.
        </p>
        <div style={{
          border: `1px solid ${colors.border}`,
          borderRadius: 10,
          height: 520,
          overflowY: "auto",
          padding: 16,
          backgroundColor: "#fff",
          marginBottom: 12,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}>
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
        <div style={{ display: "flex", gap: 8 }}>
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
      </div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ marginTop: 0 }}>Practice Puzzle</h2>
        <p style={{ color: colors.textSecondary, lineHeight: 1.7, marginBottom: 20 }}>
          Try solving this practice puzzle to get familiar with the rules. There's no time pressure
          and no right or wrong outcome — just explore. Click a cell to select it, then use the
          numpad or your keyboard to enter a number.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <KillerSudokuGrid ref={gridRef} puzzle={puzzle1} showTimer={false} showGiveUp={false} onAction={() => setActions((n) => n + 1)} />
        </div>
      </div>
      <DoneSection nextStep={() => onDone(actions, gridRef.current?.getElapsed() ?? 0)} />
    </>
  );
}

export default function Learning({ nextStep, group, currentStep }) {
  function handleDone(puzzle1Actions, puzzle1ElapsedSeconds) {
    nextStep({ puzzle1Actions, puzzle1ElapsedSeconds });
  }

  return (
    <Layout currentStep={currentStep}>
      <h1 style={{ marginTop: 0 }}>Learn Killer Sudoku</h1>
      {group === "control" && <Control onDone={handleDone} />}
      {group === "video" && <Video onDone={handleDone} />}
      {group === "ai" && <AITutor onDone={handleDone} />}
    </Layout>
  );
}

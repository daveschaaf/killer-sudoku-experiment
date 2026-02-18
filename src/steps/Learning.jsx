import { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";
import { btn, colors } from "../styles";
import ReactMarkdown from "react-markdown";

const PRACTICE_PUZZLE_URL = "https://sudokupad.app/fpuzN4IgzglgXgpiBcA2ANCALhNAbO8QBkYBDAJwDsACAaQixxIoGUBXAEwHsBrZkVI5tAAt2JBCACyASQAijCgCYALAEZeIEsxxgYaMQDFaWCsQDGgiiZh0KAd0zmiFMswC2AIxgMAZiXYuKyhRo7BSIAHQAOmRRAKJEZhS+NsgW7FiuZClEZKwKAOsAzBRu7AAeFC7MYGipZGhEEJSm5s7unsal8dgAnhTsZJaR0WQAwlZYYBQA5r7MAA4wuY0UjiZEUzAVVTVgrkEhQputHgzLhxbrMICYBJPBcwC0OF41JiJknkNRAHIhx+0uRF6JBgCyINTsQmWq0uKRgADcYJQIF4goJNkkAPSvdIuShEOjsGyTTBhNQzCCsBAAbSpoDh+OYuAArABfZB0hm4RSoKYQBFkBBoDQwNkc9K4ZSikD08UIFAgXn8wXCqUyxkIAo8vmI5WM1WchDyLVK+BCvUAXWQtOlBqQ+tl8Hk9vV8E1Cu1AtNKvZNodimdzIDCEllutatwBSD8FZPvDCH9sdtksTDqdKZdiBZobFLrTOYlUcz6cDxfjUbdip1XotVvzZdLdobRvdJrNIobkYbybr0aztd9Lu7A4jxqrbajMZ7eeHcqj/vNlpAnEMnjWG2poEsdDA1JAACVlCNVKg9/Ij2o9wVz4u43hlIoQFKtxNdweRvIL4eCiAb7aQEzHx9Z8d3gKl9zPD8TyvSD9yvb8T0Ud8f1QW8QGUD8n3GECwL3RDj33JlrxQv9EEAzcsNfQiYL3RBzxPWiP1/B00IABjIkBgMokZ4P3WjvyYl0QAAdnYzjQP3RCeNwkYHwE3A0NUTDty4h96Jk5CZzwAClJfcS90IgC1IAuSxBEnTsIIkZSLU0iTLwABOUSKL0w9DP3Q9bOI5jtKA5ycLPNzTysjTUNI8zXyvQKr08zSQAADic5S9MQwLEJi1CzN8pKcMPVTwO4i8zzyy91LstCHyzFkgA";

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

function PracticeButton() {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ marginTop: 0 }}>Practice Puzzle</h2>
      <p style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
        Now it's time to try a Killer Sudoku puzzle. This is a practice round — there's no time
        pressure and no right or wrong outcome. Use it to get familiar with the rules.
      </p>
      <p style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
        Click the button below to open the puzzle in a new tab. When you're done exploring,
        come back here and click <strong>"I'm done"</strong> to continue.
      </p>
      <button onClick={() => window.open(PRACTICE_PUZZLE_URL, "_blank")} style={btn.primary}>
        Open Practice Puzzle
      </button>
    </div>
  );
}

function DoneSection({ nextStep }) {
  return (
    <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 32, marginTop: 32 }}>
      <p style={{ color: colors.textSecondary, lineHeight: 1.7, marginBottom: 16 }}>
        When you're ready to proceed to the next step, click <strong>I'm done</strong>.
      </p>
      <button onClick={nextStep} style={{ ...btn.primary, backgroundColor: "#1a1a1a" }}>
        I'm done
      </button>
    </div>
  );
}

function Control({ nextStep }) {
  return (
    <>
      <Rules />
      <PracticeButton />
      <DoneSection nextStep={nextStep} />
    </>
  );
}

function Video({ nextStep }) {
  return (
    <>
      <Rules />
      <PracticeButton />
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
      <DoneSection nextStep={nextStep} />
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
      <PracticeButton />
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
      <DoneSection nextStep={nextStep} />
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

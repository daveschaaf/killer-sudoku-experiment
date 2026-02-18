import Layout from "../components/Layout";
import { btn, colors } from "../styles";

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
  return (
    <>
      <Rules />
      <div style={{ background: "#eef3fb", borderRadius: 10, padding: 24, marginBottom: 32, textAlign: "center", color: colors.textSecondary }}>
        <p style={{ margin: 0 }}>AI Tutor coming soon</p>
      </div>
      <button onClick={nextStep} style={btn.primary}>I'm ready to solve the puzzle</button>
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

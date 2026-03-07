import { useState } from "react";
import { updatePuzzle2 as logPuzzle2 } from "../sheets";
import Layout from "../components/Layout";
import KillerSudokuGrid from "../components/KillerSudokuGrid";
import { btn, colors } from "../styles";
import puzzle2 from "../puzzles/puzzle2.json";



function CollapsibleRules() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 24, border: `1px solid #d1d5db`, borderRadius: 8, overflow: "hidden" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 16px", background: "#f3f4f6", border: "none", cursor: "pointer",
          fontSize: 15, fontWeight: 600, color: colors.text,
        }}
      >
        <span>📋 Rules Reference</span>
        <span style={{ fontSize: 12, color: colors.textSecondary }}>{open ? "▲ Hide" : "▼ Show"}</span>
      </button>
      {open && (
        <div style={{ padding: 16, background: "#fff" }}>
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Killer Sudoku Rules</h3>
          <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8, color: colors.text }}>
            <li>Fill each cell with a number from 1 to 6.</li>
            <li>Each row, column, and 2×3 box must contain each number exactly once.</li>
            <li>Cells grouped in a cage must sum to the number in the cage's top-left corner.</li>
            <li>No number may repeat within a cage, even if the row/column allows it.</li>
          </ol>
        </div>
      )}
    </div>
  );
}

export default function Puzzle2({ nextStep, participantId, updatePuzzle2, currentStep }) {
  const [puzzle2Actions, setPuzzle2Actions] = useState(0);

  async function handleComplete({ elapsedSeconds }) {
    const data = {
      puzzle2Completed: "Yes",
      puzzle2Correct: true,
      puzzle2ElapsedSeconds: elapsedSeconds,
      puzzle2Actions,
    };

    updatePuzzle2(data);

    try {
      await logPuzzle2({ participantId, puzzle2Data: data });
    } catch (err) {
      console.error("Failed to log puzzle 2 data:", err);
    }

    nextStep();
  }

  async function handleGiveUp({ elapsedSeconds }) {
    const data = {
      puzzle2Completed: "No",
      puzzle2Correct: false,
      puzzle2ElapsedSeconds: elapsedSeconds,
      puzzle2Actions,
    };

    updatePuzzle2(data);

    try {
      await logPuzzle2({ participantId, puzzle2Data: data });
    } catch (err) {
      console.error("Failed to log puzzle 2 data:", err);
    }

    nextStep();
  }

  return (
    <Layout currentStep={currentStep}>
      <h1 style={{ marginTop: 0 }}>Test Puzzle</h1>
      <CollapsibleRules />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <KillerSudokuGrid
          puzzle={puzzle2}
          onComplete={handleComplete}
          onGiveUp={handleGiveUp}
          onAction={() => setPuzzle2Actions((n) => n + 1)}
        />
      </div>
    </Layout>
  );
}

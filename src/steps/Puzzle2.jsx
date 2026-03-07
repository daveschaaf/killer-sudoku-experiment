import { useState } from "react";
import { updatePuzzle2 as logPuzzle2 } from "../sheets";
import Layout from "../components/Layout";
import KillerSudokuGrid from "../components/KillerSudokuGrid";
import { btn, colors } from "../styles";
import puzzle2 from "../puzzles/puzzle2.json";

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
      <p style={{ color: colors.textSecondary, lineHeight: 1.7, marginBottom: 24 }}>
        This is the real puzzle. Solve it on your own — no aids are available. The timer starts now.
        When you complete it, you'll automatically move to the next step.
      </p>
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

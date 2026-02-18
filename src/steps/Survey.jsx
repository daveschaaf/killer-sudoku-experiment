import { useState } from "react";
import Layout from "../components/Layout";
import { btn, colors, label, fieldGroup, input } from "../styles";

const AGE_RANGES = ["18–24", "25–34", "35–44", "45–54", "55+"];

export default function Survey({ nextStep, updateSurvey, currentStep }) {
  const [ageRange, setAgeRange] = useState("");
  const [playedSudoku, setPlayedSudoku] = useState("");
  const [playedKillerSudoku, setPlayedKillerSudoku] = useState("");

  const allAnswered = ageRange && playedSudoku && playedKillerSudoku;

  function handleNext() {
    updateSurvey({ ageRange, playedSudoku, playedKillerSudoku });
    nextStep();
  }

  const radioGroup = { display: "flex", gap: 16, flexWrap: "wrap" };
  const radioLabel = { display: "flex", alignItems: "center", gap: 6, cursor: "pointer" };

  return (
    <Layout currentStep={currentStep}>
      <h1 style={{ marginTop: 0 }}>Background Questions</h1>
      <p style={{ color: colors.textSecondary, marginBottom: 32 }}>
        Please answer all questions before continuing.
      </p>

      <div style={fieldGroup}>
        <label style={label}>What is your age range?</label>
        <div style={radioGroup}>
          {AGE_RANGES.map((range) => (
            <label key={range} style={radioLabel}>
              <input type="radio" name="ageRange" value={range}
                checked={ageRange === range} onChange={() => setAgeRange(range)}
                style={{ accentColor: colors.primary }} />
              {range}
            </label>
          ))}
        </div>
      </div>

      <div style={fieldGroup}>
        <label style={label}>Have you played Sudoku before?</label>
        <div style={radioGroup}>
          {["Yes", "No"].map((opt) => (
            <label key={opt} style={radioLabel}>
              <input type="radio" name="playedSudoku" value={opt}
                checked={playedSudoku === opt} onChange={() => setPlayedSudoku(opt)}
                style={{ accentColor: colors.primary }} />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div style={fieldGroup}>
        <label style={label}>Have you played Killer Sudoku before?</label>
        <div style={radioGroup}>
          {["Yes", "No"].map((opt) => (
            <label key={opt} style={radioLabel}>
              <input type="radio" name="playedKillerSudoku" value={opt}
                checked={playedKillerSudoku === opt} onChange={() => setPlayedKillerSudoku(opt)}
                style={{ accentColor: colors.primary }} />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <button onClick={handleNext} disabled={!allAnswered}
        style={allAnswered ? btn.primary : btn.disabled}>
        Next
      </button>
    </Layout>
  );
}

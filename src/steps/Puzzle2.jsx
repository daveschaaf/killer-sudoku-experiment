import { useState } from "react";
import { updatePuzzle2 as logPuzzle2 } from "../sheets";
import Layout from "../components/Layout";
import { btn, colors, label, fieldGroup, input } from "../styles";

const PUZZLE_URL = "https://sudokupad.app/fpuzN4IgzglgXgpiBcA2ANCALhNAbO8QBUAnATwAIBpCLHQ0gZQFcATAewGsGRUBDBtACxaEEIALIBJACJ1SAJgAsARi4hCDHGBhoRAMSpZSMbgGN+pYzGqkA7pjPdSAOwYBbAEYxaAM0IsXpRVI0FlJEADoAHUcogFETM19rZHMWLFdHZO5HJjkAdYBmUjcWAA9SFwYwNBTHNG4IR0N4p1cPWhgSk2wyFkcLSOjHAGFLLDBSAHNfBgAHGByG0gdjbgmYcsrqsFcgkIF153dPUkX981WYQEwCceCZgFocL2rjIUdPAaiAORDDtvLuMiEGBzbjVWwCRbLC7JGAANxgjQgXiC/HWiQA9C80i5GtxqCxrONMGEVFMIEwEABtSmgWF4hi4RQAX2QtPpuEQLLZaVwAFYuSA6TyELIBUKGQh5GL2Qh8kyALrIGmCmXwKWslXC+ByjXi3Ci3WqzmGrXMk0S+D8xXKvUi6Va/nmjn2i1m7kWnXu3BS61e2UuxkByVBy0hg1+pAKpURx0R8Oaj0h9UR40R5m+hPOp3B7PwN2Z/252MF+Ci+WKkBsfSeFZrKmgCzUMBUkAAJUUQ2UqHbQ1kKlbsk7IArtrwimUAsbYxbrfyQ5HqpAfcno2b8Epbd5Q15/a3iH7iG3B6G+4XWpAinkIBXTZnc533bn++78hPw9Qo4v+WvGqna43PbPm2g6nh+i4ABw/g2q4zh237dh2V4IUeZ4WheE6/jB67AUMSE4TuqG4CAADsUEgH+M6Dn2j69u+JYgJBN7TthA5DPBbZzt+hEiIxmG3ixc54a2r5Ca+D6brhdGfooy58cxAGvuxrZblxYHnqRTH/m2r5dtptHdluunKbR3Fjhh0H8QBh5GYe1FtoeSmHlepkXleCpMkAA==";

const ANSWER_KEY = "165243";

export default function Puzzle2({ nextStep, participantId, updatePuzzle2, currentStep }) {
  const [started, setStarted] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [timerValue, setTimerValue] = useState("");
  const [topRow, setTopRow] = useState("");
  const [completed, setCompleted] = useState("");

  function openPuzzle() {
    setStarted(true);
    window.open(PUZZLE_URL, "_blank");
  }

  const canSubmit = completed;

  async function handleSubmit() {
    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
    const normalizedRow = topRow.replace(/\s+/g, "");
    const correct = normalizedRow === ANSWER_KEY;

    const data = {
      puzzle2Completed: completed,
      puzzle2TimerValue: timerValue.trim(),
      puzzle2TopRow: normalizedRow,
      puzzle2Correct: correct,
      puzzle2ElapsedSeconds: elapsedSeconds,
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
      <p style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
        This is the real puzzle. Solve it on your own — no aids are available. When you finish,
        note the timer shown in SudokuPad, then come back here to record your results.
      </p>
      <p style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
        <strong>Important:</strong> note the time shown in SudokuPad's built-in timer when you finish.
        You'll enter it below.
      </p>

      <button onClick={openPuzzle} style={{ ...btn.primary, marginBottom: 48 }}>
        {started ? "Reopen Test Puzzle" : "Open Test Puzzle"}
      </button>

      {started && (
        <div style={{ borderTop: `1px solid #e5e5e5`, paddingTop: 32 }}>
          <h2 style={{ marginTop: 0 }}>Record Your Results</h2>

          <div style={fieldGroup}>
            <label style={label}>Did you complete the puzzle?</label>
            <div style={{ display: "flex", gap: 16 }}>
              {["Yes", "No"].map((opt) => (
                <label key={opt} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                  <input type="radio" name="completed" value={opt}
                    checked={completed === opt} onChange={() => setCompleted(opt)}
                    style={{ accentColor: colors.primary }} />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div style={fieldGroup}>
            <label style={label}>SudokuPad timer (e.g. 4:32)</label>
            <input type="text" value={timerValue}
              onChange={(e) => setTimerValue(e.target.value)}
              placeholder="0:00" style={input} />
          </div>

          <div style={fieldGroup}>
            <label style={label}>Enter the 6 digits from the top row of your solution</label>
            <input type="text" value={topRow}
              onChange={(e) => setTopRow(e.target.value)}
              placeholder="e.g. 654321" maxLength={6} style={input} />
          </div>

          <button onClick={handleSubmit} disabled={!canSubmit}
            style={canSubmit ? btn.primary : btn.disabled}>
            Submit
          </button>
        </div>
      )}
    </Layout>
  );
}

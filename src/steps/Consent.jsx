import { useState } from "react";
import Layout from "../components/Layout";
import { btn, colors } from "../styles";

export default function Consent({ nextStep, currentStep }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <Layout currentStep={currentStep}>
      <h1 style={{ marginTop: 0 }}>Welcome</h1>
      <p style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
        Thank you for participating in this study. You will be introduced to a new type of puzzle
        called <strong>Killer Sudoku</strong> and asked to solve two short puzzles.
      </p>
      <p style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
        The study takes approximately <strong>20–30 minutes</strong>. You will be randomly assigned
        to one of three learning conditions before attempting the puzzles.
      </p>
      <p style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
        <strong>No personally identifiable information is collected.</strong> You will be assigned
        an anonymous participant ID. Your responses will be used solely for academic research.
      </p>
      <p style={{ color: colors.textSecondary, lineHeight: 1.7 }}>
        Participation is voluntary. You may stop at any time.
      </p>
      <p style={{ color: colors.textSecondary, lineHeight: 1.7, borderLeft: "3px solid #d1d5db", paddingLeft: 12 }}>
        To ensure the quality of this research, please complete the study in a single sitting without interruptions. Do not refresh the page, use the browser back button, or open the study in multiple tabs.
      </p>

      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, margin: "32px 0", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={{ marginTop: 3, width: 16, height: 16, flexShrink: 0, accentColor: colors.primary }}
        />
        <span style={{ color: colors.text }}>
          I have read the above information and agree to participate in this study.
        </span>
      </label>

      <button
        onClick={nextStep}
        disabled={!agreed}
        style={agreed ? btn.primary : btn.disabled}
      >
        Begin
      </button>
    </Layout>
  );
}

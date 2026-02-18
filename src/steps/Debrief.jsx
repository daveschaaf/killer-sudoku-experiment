import { useState } from "react";
import { updateFeedback as logFeedback } from "../sheets";
import Layout from "../components/Layout";
import { btn, colors } from "../styles";

export default function Debrief({ participantId, currentStep }) {
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    try {
      await logFeedback({ participantId, feedback: comment });
    } catch (err) {
      console.error("Failed to log feedback:", err);
    }
    setSubmitted(true);
  }

  return (
    <Layout currentStep={currentStep}>
      <h1 style={{ marginTop: 0 }}>Thank You!</h1>
      <p style={{ fontSize: 18, lineHeight: 1.7, color: colors.textSecondary }}>
        You've completed the study. Your responses have been recorded.
      </p>

      <h2>About This Study</h2>
      <p style={{ lineHeight: 1.7, color: colors.textSecondary }}>
        This experiment investigated whether AI-assisted learning helps people retain understanding
        of a new cognitive task compared to a video tutorial or no assistance at all. You were
        randomly assigned to one of three learning conditions before solving the practice puzzle.
        The test puzzle measured how well you retained the rules without any aid.
      </p>
      <p style={{ lineHeight: 1.7, color: colors.textSecondary }}>
        Your data will be used solely for academic research and no personally identifiable
        information was collected.
      </p>

      {!submitted ? (
        <div style={{ marginTop: 40 }}>
          <h2>Optional Feedback</h2>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
            Any comments or feedback on the study?
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Your feedback here (optional)"
            rows={4}
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: 15,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              boxSizing: "border-box",
              resize: "vertical",
              marginBottom: 16,
              backgroundColor: "#fff",
            }}
          />
          <button onClick={handleSubmit} style={btn.primary}>
            Submit Feedback
          </button>
        </div>
      ) : (
        <p style={{ marginTop: 40, color: colors.primary, fontWeight: 600, fontSize: 18 }}>
          Feedback submitted. Thanks for your input!
        </p>
      )}
    </Layout>
  );
}

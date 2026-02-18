import { initParticipant } from "../sheets";
import Layout from "../components/Layout";
import { btn, colors } from "../styles";

export default function Transition({ nextStep, participantId, group, surveyData, currentStep }) {
  async function handleNext() {
    try {
      await initParticipant({ participantId, group, surveyData });
    } catch (err) {
      console.error("Failed to log participant init:", err);
    }
    nextStep();
  }

  return (
    <Layout currentStep={currentStep}>
      <h1 style={{ marginTop: 0 }}>Get Ready</h1>
      <p style={{ fontSize: 18, lineHeight: 1.7, color: colors.textSecondary }}>
        Great work on the practice puzzle.
      </p>
      <p style={{ fontSize: 18, lineHeight: 1.7, color: colors.textSecondary }}>
        From this point on, <strong>no learning aids are available</strong> — no video, no AI tutor,
        and no hints. You'll now solve a new puzzle entirely on your own.
      </p>
      <p style={{ fontSize: 18, lineHeight: 1.7, color: colors.textSecondary }}>
        Take a moment to recall the rules, then click below when you're ready.
      </p>
      <button onClick={handleNext} style={btn.primary}>
        I'm ready for the test puzzle
      </button>
    </Layout>
  );
}

import { colors } from "../styles";

const STEP_LABELS = ["Consent", "Survey", "Learning", "Transition", "Test Puzzle", "Debrief"];

export default function Layout({ currentStep, children }) {
  const totalSteps = STEP_LABELS.length;
  const progressPct = (currentStep / (totalSteps - 1)) * 100;

  return (
<div style={{ 
  minHeight: "100vh", 
  width: "100%",
  backgroundColor: colors.background, 
  fontFamily: "system-ui, sans-serif" 
}}>
      {/* Header */}
      <div style={{
        backgroundColor: "#fff",
        borderBottom: `1px solid ${colors.border}`,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <span style={{ fontWeight: 700, fontSize: 16, color: colors.text }}>
          Killer Sudoku Experiment
        </span>
        <span style={{ fontSize: 14, color: colors.textSecondary }}>
          Step {currentStep + 1} of {totalSteps} — {STEP_LABELS[currentStep]}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, backgroundColor: colors.border }}>
        <div style={{
          height: "100%",
          width: `${progressPct}%`,
          backgroundColor: colors.primary,
          transition: "width 0.4s ease",
        }} />
      </div>

      {/* Content */}
	<div style={{ 
	  maxWidth: 960, 
	  margin: "0 auto", 
	  padding: "48px 48px 80px",
	  width: "100%",
	  boxSizing: "border-box"
	}}>
        {children}
      </div>
    </div>
  );
}

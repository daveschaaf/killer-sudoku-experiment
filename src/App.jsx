import { useState, useEffect } from "react";
import Consent from "./steps/Consent";
import Survey from "./steps/Survey";
import Learning from "./steps/Learning";
import Transition from "./steps/Transition";
import Puzzle2 from "./steps/Puzzle2";
import Debrief from "./steps/Debrief";

const STEPS = ["CONSENT", "SURVEY", "LEARNING", "TRANSITION", "PUZZLE_2", "DEBRIEF"];
const GROUPS = ["control", "video", "ai"];

function randomGroup() {
  return GROUPS[Math.floor(Math.random() * GROUPS.length)];
}

function loadSession() {
  try {
    const saved = sessionStorage.getItem("ks_session");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveSession(data) {
  try {
    sessionStorage.setItem("ks_session", JSON.stringify(data));
  } catch {}
}

export default function App() {
  const session = loadSession();

  const [currentStep, setCurrentStep] = useState(session?.currentStep ?? 0);
  const [group] = useState(session?.group ?? randomGroup());
  const [participantId] = useState(session?.participantId ?? crypto.randomUUID());
  const [surveyData, setSurveyData] = useState(session?.surveyData ?? {});
  const [puzzle1Actions, setPuzzle1Actions] = useState(session?.puzzle1Actions ?? 0);
  const [puzzle1ElapsedSeconds, setPuzzle1ElapsedSeconds] = useState(session?.puzzle1ElapsedSeconds ?? 0);
  const [puzzle1TabSwitches, setLearningTabSwitches] = useState(session?.puzzle1TabSwitches ?? 0);
  const [puzzle2Data, setPuzzle2Data] = useState(session?.puzzle2Data ?? {});
  const [feedbackData, setFeedbackData] = useState(session?.feedbackData ?? {});

  // Persist session to sessionStorage on every state change
  useEffect(() => {
    saveSession({ currentStep, group, participantId, surveyData, puzzle1Actions, puzzle1ElapsedSeconds, puzzle1TabSwitches, puzzle2Data, feedbackData });
  }, [currentStep, group, participantId, surveyData, puzzle1Actions, puzzle1ElapsedSeconds, puzzle1TabSwitches, puzzle2Data, feedbackData]);

  // Warn on refresh/close if past consent screen
  useEffect(() => {
    function handleBeforeUnload(e) {
      if (currentStep > 0 && currentStep < STEPS.length - 1) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentStep]);

  function nextStep(data) {
    if (data?.puzzle1Actions !== undefined) setPuzzle1Actions(data.puzzle1Actions);
    if (data?.puzzle1ElapsedSeconds !== undefined) setPuzzle1ElapsedSeconds(data.puzzle1ElapsedSeconds);
    if (data?.puzzle1TabSwitches !== undefined) setLearningTabSwitches(data.puzzle1TabSwitches);
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo(0, 0);
  }

  function updateSurvey(data) {
    setSurveyData((prev) => ({ ...prev, ...data }));
  }

  function updatePuzzle2(data) {
    setPuzzle2Data((prev) => ({ ...prev, ...data }));
  }

  function updateFeedback(data) {
    setFeedbackData((prev) => ({ ...prev, ...data }));
  }

  const props = {
    nextStep, group, participantId, currentStep,
    surveyData, updateSurvey,
    puzzle1Actions, puzzle1ElapsedSeconds, puzzle1TabSwitches,
    puzzle2Data, updatePuzzle2,
    feedbackData, updateFeedback,
  };

  const steps = {
    CONSENT: <Consent {...props} />,
    SURVEY: <Survey {...props} />,
    LEARNING: <Learning {...props} />,
    TRANSITION: <Transition {...props} />,
    PUZZLE_2: <Puzzle2 {...props} />,
    DEBRIEF: <Debrief {...props} />,
  };

  return <div>{steps[STEPS[currentStep]]}</div>;
}

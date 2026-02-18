import { useState } from "react";
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

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [group] = useState(randomGroup);
  const [participantId] = useState(() => crypto.randomUUID());
  const [surveyData, setSurveyData] = useState({});
  const [puzzle2Data, setPuzzle2Data] = useState({});
  const [feedbackData, setFeedbackData] = useState({});

  function nextStep() {
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
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

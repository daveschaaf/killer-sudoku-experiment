const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export async function initParticipant({ participantId, group, surveyData, puzzle1Actions, puzzle1ElapsedSeconds, puzzle1TabSwitches, aiMessageCount }) {
  return fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({
      action: "init",
      participantId,
      group,
      timestamp: new Date().toISOString(),
      ageRange: surveyData.ageRange,
      playedSudoku: surveyData.playedSudoku,
      playedKillerSudoku: surveyData.playedKillerSudoku,
      puzzle1Actions,
      puzzle1ElapsedSeconds,
      puzzle1TabSwitches,
      aiMessageCount,
    }),
  });
}

export async function updatePuzzle2({ participantId, puzzle2Data }) {
  return fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({
      action: "update",
      participantId,
      ...puzzle2Data,
    }),
  });
}

export async function updateFeedback({ participantId, feedback }) {
  return fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({
      action: "feedback",
      participantId,
      feedback,
    }),
  });
}

export async function logMessage({ participantId, sequenceNumber, role, message }) {
  return fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({
      action: "logMessage",
      participantId,
      sequenceNumber,
      role,
      timestamp: new Date().toISOString(),
      message,
    }),
  });
}

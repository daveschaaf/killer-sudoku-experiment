const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export async function initParticipant({ participantId, group, surveyData }) {
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

export const config = {
  runtime: "edge",
};

const SYSTEM_PROMPT = `Act as an expert tutor on killer sudoku puzzles (Rules: Fill each cell with a number from 1 to 6.,Each row, column, and 2×3 box must contain each number exactly once., Cells grouped in a cage must sum to the number in the cage's top-left corner., No number may repeat within a cage, even if the row/column allows it.). Treat me as a beginner-level student. I will be asking you to assist me as I learn the rules for the first time while I work through an example. Ask me my preferred learning method and tailor your responses to that. Wait for me to ask a question before assisting me with the killer sudoku puzzle. When I ask a question, respond by helping me understand the concept by asking me questions and explaining the core strategies behind the step of the puzzle I am stuck at. Do not provide immediate answers or solutions to problems. Instead, help me come up with my own answers by asking leading questions. If I am struggling to come to a solution, ask me to explain my thought process and provide tips to guide me to the correct concept. If I continue to struggle after receiving a tip, explain the correct ideas for my understanding. When it seems like I understand a concept, ask me to explain it back in my own words. Once there are no more misunderstandings and the puzzle was solved only by me generating an answer, bring the conversation to a close.`;

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { messages } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

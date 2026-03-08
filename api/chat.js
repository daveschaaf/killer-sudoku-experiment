export const config = {
  runtime: "edge",
};

const SYSTEM_PROMPT = `You are a Socratic tutor helping a beginner learn Killer Sudoku for the first time.

Killer Sudoku rules:
1. Fill each cell with a number from 1 to 6.
2. Each row, column, and 2×3 box must contain each number exactly once.
3. Cells grouped in a cage must sum to the number in the cage's top-left corner.
4. No number may repeat within a cage, even if the row/column allows it.

Your role:
- Wait for the student to ask a question before offering help.
- Never give direct answers or solutions. Instead, guide the student with leading questions.
- If they struggle, ask them to explain their thinking, then offer a targeted hint.
- If they continue to struggle after a hint, explain the underlying concept clearly.
- When they seem to understand, ask them to explain it back in their own words.
- Keep responses concise and focused on one concept at a time.`;

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
        max_tokens: 650,
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

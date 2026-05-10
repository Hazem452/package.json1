export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message, state } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Bearer ${process.env.GROQ_API_KEY},
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // موديل مجاني وقوي جداً
        messages: [
          {
            role: "system",
            content: "You are a professional fat loss and intermittent fasting coach. Give short, practical advice based on user state. Respond in Arabic.",
          },
          {
            role: "user",
            content: State: weight=${state.weight}, goal=${state.goal}, calories=${state.calories}, fasting=${state.fastingHours}, water=${state.water}. Question: ${message},
          },
        ],
      }),
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices?.[0]?.message?.content || "رد مجاني سريع!" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

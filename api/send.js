export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const data = req.body;

    const message = `
❤️ Замира ответила на приглашение!

📅 Дата: 24 августа 2026

🕘 Встреча: ${data.meetTime || "—"}

❤️ План: ${data.choice || "—"}

🍽 Еда: ${data.food || "—"}

💳 Платит: ${data.payment || "—"}

🥰 Ждёт встречу: ${data.waitPercent ?? "—"}%

🎬 Кино: Человек-паук — 21:50
`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: "7753950534",
          text: message
        })
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResult.ok) {
      return res.status(500).json({
        ok: false,
        error: telegramResult.description
      });
    }

    return res.status(200).json({
      ok: true
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}

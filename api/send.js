export default async function handler(req, res) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://kora-sage-kappa.vercel.app"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  // OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Только POST
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    // Проверяем переменные Vercel
    if (!process.env.BOT_TOKEN) {
      return res.status(500).json({
        ok: false,
        error: "BOT_TOKEN is not configured"
      });
    }

    if (!process.env.CHAT_ID) {
      return res.status(500).json({
        ok: false,
        error: "CHAT_ID is not configured"
      });
    }

    const data = req.body || {};

    const meetTime =
      data.meetTime || "—";

    const choice =
      data.choice || "—";

    const food =
      data.food || "—";

    const payment =
      data.payment || "—";

    const waitPercent =
      data.waitPercent ?? "—";

    const message = `
❤️ Замира ответила на приглашение!

📅 Дата: 24 августа 2026

🕘 Встреча: ${meetTime}

❤️ План: ${choice}

🍽 Еда: ${food}

💳 Платит: ${payment}

🥰 Ждёт встречу: ${waitPercent}%

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
          chat_id: process.env.CHAT_ID,
          text: message
        })
      }
    );

    const telegramResult =
      await telegramResponse.json();

    console.log(
      "Telegram response:",
      telegramResult
    );

    if (!telegramResult.ok) {
      return res.status(500).json({
        ok: false,
        error:
          telegramResult.description ||
          "Telegram API error"
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Successfully sent to Telegram"
    });

  } catch (error) {

    console.error(
      "API error:",
      error
    );

    return res.status(500).json({
      ok: false,
      error:
        error.message ||
        "Internal server error"
    });
  }
}

```javascript
export default async function handler(req, res) {
  // Разрешаем запросы с твоего сайта
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

  // CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Разрешаем только POST
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  // Проверяем секретные переменные
  if (!process.env.BOT_TOKEN) {
    return res.status(500).json({
      ok: false,
      error: "BOT_TOKEN отсутствует"
    });
  }

  if (!process.env.CHAT_ID) {
    return res.status(500).json({
      ok: false,
      error: "CHAT_ID отсутствует"
    });
  }

  try {
    const data = req.body || {};

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
      ok: true
    });

  } catch (error) {

    console.error(
      "Server error:",
      error
    );

    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
```

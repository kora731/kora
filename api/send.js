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
      error: "Method not allowed",
      method: req.method
    });
  }

  try {
    console.log("=== /api/send START ===");

    // Проверяем BOT_TOKEN
    if (!process.env.BOT_TOKEN) {
      console.error("BOT_TOKEN отсутствует");

      return res.status(500).json({
        ok: false,
        error: "BOT_TOKEN не найден в Environment Variables"
      });
    }

    console.log("BOT_TOKEN найден");

    // Проверяем CHAT_ID
    if (!process.env.CHAT_ID) {
      console.error("CHAT_ID отсутствует");

      return res.status(500).json({
        ok: false,
        error: "CHAT_ID не найден в Environment Variables"
      });
    }

    console.log(
      "CHAT_ID:",
      process.env.CHAT_ID
    );

    // Получаем данные
    const data = req.body || {};

    console.log(
      "Получены данные:",
      data
    );

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

    // Сообщение
    const message =
`❤️ Замира ответила на приглашение!

📅 Дата: 24 августа 2026

🕘 Встреча: ${meetTime}

❤️ План: ${choice}

🍽 Еда: ${food}

💳 Платит: ${payment}

🥰 Ждёт встречу: ${waitPercent}%

🎬 Кино: Человек-паук — 21:50`;

    console.log(
      "Отправляем сообщение в Telegram..."
    );

    // Telegram API
    const telegramResponse =
      await fetch(
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

    console.log(
      "Telegram HTTP status:",
      telegramResponse.status
    );

    // Получаем ответ Telegram как текст
    const telegramText =
      await telegramResponse.text();

    console.log(
      "Telegram response:",
      telegramText
    );

    let telegramResult;

    try {
      telegramResult =
        JSON.parse(telegramText);
    } catch (parseError) {

      console.error(
        "Telegram вернул не JSON:",
        telegramText
      );

      return res.status(500).json({
        ok: false,
        error:
          "Telegram вернул некорректный ответ",
        telegramStatus:
          telegramResponse.status,
        telegramResponse:
          telegramText
      });
    }

    // Telegram сообщил ошибку
    if (!telegramResult.ok) {

      console.error(
        "Ошибка Telegram:",
        telegramResult
      );

      return res.status(500).json({
        ok: false,
        error:
          telegramResult.description ||
          "Telegram API error",

        telegramErrorCode:
          telegramResult.error_code || null
      });
    }

    console.log(
      "=== /api/send SUCCESS ==="
    );

    return res.status(200).json({
      ok: true
    });

  } catch (error) {

    console.error(
      "=== /api/send ERROR ==="
    );

    console.error(error);

    return res.status(500).json({
      ok: false,
      error:
        error?.message ||
        String(error)
    });
  }
}

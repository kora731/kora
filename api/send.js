export default async function handler(req, res) {

    // ===============================
    // CORS
    // ===============================

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


    // ===============================
    // OPTIONS
    // ===============================

    if (req.method === "OPTIONS") {

        return res.status(200).end();

    }


    // ===============================
    // ТОЛЬКО POST
    // ===============================

    if (req.method !== "POST") {

        return res.status(405).json({

            success: false,

            error: "Method not allowed"

        });

    }


    // ===============================
    // ОСНОВНОЙ КОД
    // ===============================

    try {

        const message = req.body?.message;


        // Проверяем сообщение

        if (!message) {

            return res.status(400).json({

                success: false,

                error: "Сообщение отсутствует"

            });

        }


        // ===============================
        // ENV VARIABLES
        // ===============================

        const BOT_TOKEN =
            process.env.BOT_TOKEN;

        const CHAT_ID =
            process.env.CHAT_ID;


        // Проверяем настройки

        if (!BOT_TOKEN || !CHAT_ID) {

            console.error(
                "BOT_TOKEN или CHAT_ID отсутствует"
            );

            return res.status(500).json({

                success: false,

                error:
                    "BOT_TOKEN или CHAT_ID не настроены"

            });

        }


        // ===============================
        // TELEGRAM API
        // ===============================

        const response = await fetch(

            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    chat_id: CHAT_ID,

                    text: message

                })

            }

        );


        const data =
            await response.json();


        console.log(
            "Telegram:",
            data
        );


        // ===============================
        // ОШИБКА TELEGRAM
        // ===============================

        if (!data.ok) {

            return res.status(500).json({

                success: false,

                error:
                    data.description ||
                    "Ошибка Telegram"

            });

        }


        // ===============================
        // УСПЕХ
        // ===============================

        return res.status(200).json({

            success: true

        });


    } catch (error) {

        console.error(
            "Ошибка:",
            error
        );


        return res.status(500).json({

            success: false,

            error: error.message

        });

    }

}

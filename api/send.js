const express = require("express");

const app = express();

const PORT = 3000;


// ===============================
// TELEGRAM
// ===============================

const BOT_TOKEN = "ТВОЙ_ТОКЕН";
const CHAT_ID = "ТВОЙ_CHAT_ID";


// ===============================
// SERVER
// ===============================

app.use(express.json());


// Показываем index.html
app.use(express.static(__dirname));


// ===============================
// TELEGRAM API
// ===============================

app.post("/api/telegram", async (req, res) => {

    try {

        const message = req.body.message;


        const response = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
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


        if (!data.ok) {

            return res.status(500).json({
                success: false
            });

        }


        res.json({
            success: true
        });


    } catch (error) {

        console.error(
            "Ошибка:",
            error
        );


        res.status(500).json({
            success: false
        });

    }

});


// ===============================
// START
// ===============================

app.listen(PORT, () => {

    console.log("");
    console.log("==============================");
    console.log("❤️ САЙТ ЗАПУЩЕН");
    console.log("==============================");
    console.log(
        `http://localhost:${PORT}`
    );
    console.log("==============================");
    console.log("");

});

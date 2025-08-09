const TelegramBot = require("node-telegram-bot-api");
const express = require("express")
const cors = require("cors")

token = "7967984347:AAG5h9rGwBywC4YBFdw7N48HliaLSSEm54Y"
const webAppUrl = "https://app-telegram-web-store.onrender.com"

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if(text === "/start") {
    await bot.sendMessage(chatId, "The button will appear below, please fill out the form", {
      reply_markup: {
        keyboard: [ 
          [{text: "Fill out the form", web_app: {url: webAppUrl + "/form"}}]
        ]
      }
    })

    await bot.sendMessage(chatId, "Enter our internet shop by clicking button below", {
      reply_markup: {
        inline_keyboard: [ 
          [{text: "Place an order", web_app: {url: webAppUrl}}]
        ]
      }
    })
  }

  if(msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data)
      console.log(data);
      
      await bot.sendMessage(chatId, "Your country: " + data?.country)
      await bot.sendMessage(chatId, "Your city: " + data?.city)
    } catch (e) {
      console.log(e);
    }

  }
})

app.post("/web-data", async ( req, res) => {
  const { queryId, products, totoalPrice } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Successfull Purchase",
      input_message_content: {
        message_text: `Congrats with purchase, you have purchased goods totaling ${totoalPrice}`
      }
    })
    return res.status(200).json({})
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Failed to purchase the items",
      input_message_content: {
        message_text: "Failed to purchase the items"
      }
    })
    return res.status(500).json({})
  }
})

const PORT = process.env.PORT || 8000;

app.listen(PORT,"0.0.0.0",  () => console.log(`Server started on PORT ${PORT}`))
// index.js
const { Snake } = require("tgsnake")
const { Telegraf } = require("telegraf")
const Tesseract = require("tesseract.js")
const fs = require("fs")

const account = {
  gilang: {
    appId: 9793611,
    apiHash: "e85c524bb4bd76de514a428f79b1af10",
    session:
      "1BQANOTEuMTA4LjU2LjExMQG7oBJwjvIaF9s+qy6DzBR/B5+sxhisZyMi/pS+9pFCx6KrScK+fTo5qKkVpb2+ey6OVw6dZbfi6ZzXaui551+2Lup/mmVqizOwG+sHylEmef5o6qbFQ5ZVxny30CqRanFfpel+XyLso12nrNbPc/5Ra0c0J1E0/O4pWmNymmmaUO7BiF97hHY7yyWj7NdVqHphw6mp7He2x/90ArsVth3yU4gZ2jh6h5sINrc4/0/WP7KfalgBT/jeM2uY25sXwHPoSWjnJrmXbj0H6aFzmsvrKeMbvdeAqlBH07xR0BELtnFss+jlh6/Ve9qo/XO38XTNglY+Z3Kk6kQcOqR2j1kFGw==",
  },
  amelia: {
    appId: 18003934,
    apiHash: "cd9eb800a7b76384977738e6d3e94301",
    session:
      "1BQANOTEuMTA4LjU2LjEzMAG7s5TXJ+vuprSGIIh+Flq1HglaicLXgrb4t//+R4yc354qiokHCj+p4PTmg/vxapwxJixjKzwGnR1IqZ1BLHi5g3VUvrrJsWRfp7kmbSaW84ggK7A8QwArfYkdnCBF5Iq+sYLfGOAnQVIjal/6Hu0DiM7Alh9ye/5/RFckm33zq1hPH/fdK2epygtb8rmpFXWajd/gsN7B+GaXsgFOtbP+lBBb/L0+w+F6O7s2mhs9qsWrrZ1H0Fxjqu2bkr3JsSFNKSNl6++wk1p1DTd0eBFdKXoV89DV9bBeBflnGalNgC4sGBHWqayRIpmGl23BQC0jJIgpkShpQaWpnczVj13OnA==",
  },
}

const group = { opank: "-1001962626950", oyen: "-1001909548840" }
const process = { logs: 30, count: 0 }

let logfile = "./logs/logsTelegram.json"
let logs = require(logfile)

const timmy = new Telegraf("6107155056:AAHD_thIjVila1NoMfJKwVoXbeJEuyOyG_k")
const snake = new Snake({
  apiHash: account.amelia.apiHash,
  apiId: account.amelia.appId,
  session: account.amelia.session,
})

const telegram = async (data) => {
  try {
    await timmy.telegram.sendMessage(
      group.opank,
      `${data.chat}\n\n📌 process ${process.count}\n🕹️ ${data.groupname}\n🙇‍♂️ ${data.username || data.name}`,
      {
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [[{ text: data?.groupname?.toUpperCase() + " | TELEGRAM", url: "https://t.me/" + data.username, callback_data: "late" }]],
        },
      }
    )
  } catch (error) {
    console.log({ error, msg: "ERROR ON FUNCTION TELEGRAM" })
  }
}

const sendMsg = async (data) => {
  try {
    if (logs.length > process.logs) logs = []

    if (!logs.find((x) => x.chat === data.chat) && data.groupname !== "OYENNN" && data.groupname !== "O P A N K") {
      await timmy.telegram.sendChatAction(group.opank, "typing")
      await telegram(data)

      logs.push(data)
      fs.writeFileSync(logfile, JSON.stringify(logs, null, 2))
    }

    console.log(data)
  } catch (error) {
    console.log({ error, msg: "ERROR ON FUNCTION SENDMSG" })
  }
}

snake.command("yung", async (ctx) => {
  try {
    await ctx.reply("Tiup hidungku nanti hidungku bakal bilang moal moal moal...")
  } catch (error) {
    console.log("ERROR PAK BOSS")
  }
})

snake.command("ngepel", async (ctx) => {
  try {
    await ctx.reply("Ngepelku adalah KUNGFU...")
  } catch (error) {
    console.log("ERROR PAK BOSS")
  }
})

snake.command("chum", async (ctx) => {
  try {
    await ctx.reply("Crot crot ahhh... 🍆👌")
  } catch (error) {
    console.log("ERROR PAK BOSS")
  }
})

snake.command("late", async (ctx) => {
  try {
    await ctx.reply("Emang babi lu semua akun tuyul gua late...\n\n* mendadak bumi dan seisinya seketika salah")
  } catch (error) {
    console.log("ERROR PAK BOSS")
  }
})

snake.command("oyen", async (ctx) => {
  try {
    await ctx.reply("Yen Yen emang kucing paling lucu...")
  } catch (error) {
    console.log("ERROR PAK BOSS")
  }
})

snake.command("gembul", async (ctx) => {
  try {
    await ctx.reply("Dih najis si kucing manja bloon")
  } catch (error) {
    console.log("ERROR PAK BOSS")
  }
})

snake.command("amelia", async (ctx) => {
  try {
    await ctx.reply("Gua mau bagi daget 69rb pada mau gak?")
  } catch (error) {
    console.log("ERROR PAK BOSS")
  }
})

timmy.command("timmy", async (ctx) => {
  try {
    await ctx.reply("Guk, guk diam kau ASW !!!")
  } catch (err) {
    console.log("\n\n", { err, msg: "ERROR COMMAND BOT TIMMY" })
  }
})

timmy.on("photo", async (ctx) => {
  try {
    const photo = ctx.message.photo
    const file_id = photo[photo.length - 1].file_id

    await ctx.reply("Sabar Timmy sedang menganalisa...")

    timmy.telegram
      .getFileLink(file_id)
      .then((link) => {
        Tesseract.recognize(link.href, "eng")
          .then(async ({ data: { text } }) => await ctx.reply(text))
          .catch((err) => Throw({ msg: "ERROR BOSS" }))
      })
      .catch((err) => Throw({ msg: "ERROR BOSS" }))
  } catch (err) {
    console.log("\n\nDETEKSI GAMBAR GAGAL")
  }
})

snake.on("message", async (ctx) => {
  const data = {
    id: ctx?.id,
    chat: ctx?.text,
    name: (ctx?.from?.firstName ? ctx?.from?.firstName + " " : "" + ctx?.from?.lastName ? ctx?.from?.lastName : "").trim() || "Anonymous",
    username: ctx?.from?.username,
    groupname: ctx?.chat?.title || "PERSONAL CHAT",
  }

  if (ctx?.text && ctx?.entities) {
    if (ctx?.entities.map((x) => x.url).length > 0) {
      data.chat += "\n\nHIDE LINK: " + ctx?.entities.map((x) => x.url).join("\n")
    }
  }

  if (
    data?.chat?.toLowerCase().includes("dana.id") ||
    data?.chat?.toLowerCase().includes("danaindonesia") ||
    data?.chat?.toLowerCase().includes("dana.id") ||
    data?.chat?.toLowerCase().includes("shope.ee") ||
    data?.chat?.toLowerCase().includes("sppay")
  ) {
    await sendMsg(data)
  }

  process.count++
})

snake.run()

timmy.launch()

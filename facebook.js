const { Telegraf } = require("telegraf")
const fs = require("fs")
const axios = require("axios")

let token = require("./data/token.json")
let groups = require("./data/facebook.json")
let logsFile = "./logs/logsFacebook.json"
let logs = require(logsFile)

const bot = [
  { name: "Amon", token: "6330855133:AAEhvPiovs-QJ8mMyACHdam0j76J76fk-W0" },
  { name: "Opank", token: "6516245543:AAEPXLHDut-6tyRQNIj7cqxqVVdoGfet1Es" },
  { name: "Oyen", token: "6293865566:AAGZQgNcYU3HmnmYw3V-B2DkWu7z_-WmGxo" },
  { name: "Yuli", token: "6694843798:AAEHQChaaGX1HyK3kZUXnaLoweK6yVcm394" },
  { name: "Nunu", token: "6483002423:AAHr0FBQJO4RIelCJcAsB-uV8w45gmyOMgM" },
  { name: "Kumang", token: "6659028719:AAFW_J7nr_KDHhC4QZfAmbM1Ozirg5P3QXs" },
  { name: "Moncil", token: "6429928140:AAFmPqqikcaNNPCNG3KpuL8VAxgsB_UG_sA" },
  { name: "Gembul", token: "6429373393:AAESNtqq5Od4gr8ZBTA000zJGjaVLi-k6MI" },
]

const config = {
  post: 15,
  comment: 25,
  botIndex: 0,
  logs: 200,
  error: 0,
  process: 0,
  opank: "-1001962626950",
  oyen: "-1001909548840",
  bot: { Oyen: new Telegraf("6293865566:AAGZQgNcYU3HmnmYw3V-B2DkWu7z_-WmGxo") },
}

bot.forEach(async (x) => {
  try {
    config.bot[x.name] = new Telegraf(x.token)
    await config.bot[x.name].launch()
  } catch (error) {
    console.log({ error, msg: "ERROR ON FOREACH BOT" + x.name })
  }
})

groups.forEach((x, i) => {
  x.tokenIndex = i
  x.found = 0
  x.process = 0
})

const msgChecker = async (group, msg) => {
  try {
    const link = msg?.match(/https?:\/\/link\.dana\S+/g)

    if (logs.length > config.logs) logs = []

    if (link) {
      const danalink = link.join("\n")
      const check = logs.find((x) => x === danalink)

      if (!check) {
        group.found++
        const text = `😻 PROCESS ${group.process}, FOUND: ${group.found}, TOTAL ${config.process}\n\n${danalink}`
        await config.bot[bot[config.botIndex].name].telegram.sendMessage(config.opank, text, {
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `${group.name} | FACEBOOK`,
                  url: `https://www.facebook.com/groups/${group.postId.split("_")[0]}/permalink/${group.postId.split("_")[1]}/`,
                },
              ],
            ],
          },
        })
        logs.push(danalink)
        fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2))

        config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
      }
    }
  } catch (error) {
    config.error++
    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++

    console.log({
      error: error,
      msg: "ERROR ON PROCESS MSG CHECKER, BOT " + bot[config.botIndex].name + ", TOKEN " + token[group.tokenIndex].name,
    })
  }
}

const facebook = async (group) => {
  try {
    const postURL = `https://graph.facebook.com/v12.0/${group.groupId}/feed?access_token=${token[group.tokenIndex].token}&limit=${config.post}`
    const { data: posts } = await axios(postURL)

    for (x of posts.data) {
      console.log(config.process, `\x1b[32mPOSTING\t\x1b[33m${token[group.tokenIndex].name.slice(0, 6)}\t\t${group.name.toUpperCase()}`)
      config.process++
      group.process++
      group.postId = x.id

      msgChecker(group, x?.message)

      const commentURL = `https://graph.facebook.com/v12.0/${x.id}/comments?access_token=${token[group.tokenIndex].token}&limit=${config.comment}`
      const { data: comments } = await axios(commentURL)
      for (y of comments.data) {
        console.log(config.process, `COMMENT\t\x1b[33m${token[group.tokenIndex].name.slice(0, 6)}\t\t${group.name.toUpperCase()}`)
        config.process++
        group.process++

        msgChecker(group, y?.message)
      }
    }

    facebook(group)
  } catch (error) {
    console.log({
      error: error.response.data.error.message || "UNKNOWN ERROR",
      msg: "ERROR ON PROCESS FACEBOOK, GROUP " + group.name + ", BOT " + bot[config.botIndex].name + ", TOKEN " + token[group.tokenIndex].name,
    })
    group.tokenIndex >= token.length - 1 ? (group.tokenIndex = 0) : group.tokenIndex++
    facebook(group)
  }
}

const romy = { name: "Romy", token: "6559515080:AAEcfv2LSTREpLX8cP2KCtWm3pKsNIgN5pQ" }
const romyBot = new Telegraf(romy.token)

romyBot.command("test", async (ctx) => {
  try {
    await ctx.reply(bot[config.botIndex].name.toUpperCase() + " SIAPP !!!", {
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: `SEBANYAK ${config.process} PESAN SUDAH ${bot[config.botIndex].name.toUpperCase()} PANTAU`, callback_data: "late" }],
        ],
      },
    })
    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
  } catch (error) {
    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
    console.log({ error, msg: "ERROR ON PROCESS COMMAND KUMANG" })
  }
})

romyBot.launch()

groups.forEach((x, index) => facebook(x))

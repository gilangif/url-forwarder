const { Telegraf } = require("telegraf")
const whatsapp = require("wa-multi-session")
const fs = require("fs")

let logsFile = "./logs/logsWhatsapp.json"
let groups = require("./data/whatsapp.json")
let logs = require(logsFile)

let config = { count: 0, logs: 100, bot: {}, botIndex: 0, oyen: "-1001909548840", opank: "-1001962626950" }

let bot = [
  { name: "Fang Fang", token: "6892133845:AAFLimtSlQ5iLnesvBk4qP_-YE5nwk_hH3Y" },
  { name: "Tn. In In", token: "6031592748:AAGscrN5FeJ8M1c6e-kCi-8emmjINF6jKXM" },
  { name: "Meyhang", token: "6565780808:AAFlxbwz3nMC3DY9nneVLZKT4nREPJQShJw" },
  { name: "Jenny", token: "6485261723:AAEmfkGPtZFtUBoPiWxc-TvM_SkHCgwNzxM" },
  { name: "Choco", token: "6443955175:AAGvudm3uzVnxzHAEdEHfCAQRiVOxthLz1A" },
  { name: "Clara", token: "6544279962:AAER02Wpn8aM0M-Tf51QLf6tuGn5Er0Zzn4" },
  { name: "Yoko", token: "6691155059:AAFWi4m1K__yU2NPIif7P7Nub6JrA3UL2wI" },
  { name: "Shiro", token: "6886385156:AAFXXiIVSjY4CNt40X5XcCeKIvDPWMls2hA" },
]

bot.forEach(async (x) => {
  try {
    config.bot[x.name] = new Telegraf(x.token)
    await config.bot[x.name].launch()
  } catch (error) {
    console.log({ error, msg: "ERROR ON FOREACH BOT" + x.name })
  }
})

const oyen = async (data, text) => {
  try {
    await config.bot[bot[config.botIndex].name].telegram.sendMessage(config.oyen, text, {
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [[{ text: data?.group?.toUpperCase(), callback_data: "late" }]],
      },
    })

    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
  } catch (error) {
    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
    console.log({ error, msg: "ERROR ON FUNCTION TELEGRAM" })
  }
}

const opank = async (data, text) => {
  try {
    await config.bot[bot[config.botIndex].name].telegram.sendMessage(config.opank, text, {
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [[{ text: data?.group?.toUpperCase(), callback_data: "late" }]],
      },
    })
    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
  } catch (error) {
    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
    console.log({ error, msg: "ERROR ON FUNCTION TELEGRAM" })
  }
}

const msgChecker = async (data) => {
  try {
    let text = `${data.chat}\n\n🐱 WHATSAPP PROCESS ${config.count}\n😻 ${data.groupname.toUpperCase().trim()}\n😹 ${data.name}`

    if (logs.length > config.logs) logs = []
    if (logs.find((x) => x.chat === data.chat)) return { msg: "DUPLICATE" }

    if (config.group[data.from]) {
      opank(data, text)
    } else {
      oyen(data, text)
      text = `Chummm ada pesan di list blacklist, buruan cek !!!!\n\n${data.name}\n${data.groupname.toUpperCase().trim()}\n😹😻🐱🙀😺`
      opank(data, text)
    }

    logs.push(data)
    fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2))
    console.log(data)
  } catch (error) {
    console.log({ error, msg: "ERROR ON FUNCTION SENDMSG" })
  }
}

const main = async () => {
  try {
    const session = await whatsapp.startSession("mysessionid")

    groups.forEach((x) => {
      if (!config.allGroup) config.allGroup = {}
      if (!config.group) config.group = {}
      if (!x.blacklist) config.group[x.from] = x.name

      config.allGroup[x.from] = x.name
    })

    whatsapp.onConnected(async (sessionId) => {
      console.log("# Connected\n\n")
    })

    whatsapp.onMessageReceived(async (msg) => {
      const data = {
        process: config.count,
        isMe: msg?.key?.fromMe || false,
        name: msg?.pushName?.toUpperCase().trim(),
        from: msg?.key?.remoteJid,
        participant: msg?.key?.participant,
        chat: msg?.message?.extendedTextMessage?.text || msg?.message?.conversation,
        sessionId: msg.sessionId,
        groupname: config?.allGroup[msg?.key?.remoteJid]?.toUpperCase().trim() || "UNKNOWN GROUP, PERSONAL OR STORY",
        group: config?.group[msg?.key?.remoteJid] || "BLACKLIST",
      }

      const daget =
        data?.chat?.toLowerCase().includes("dana.id") ||
        data?.chat?.toLowerCase().includes("danaindonesia") ||
        data?.chat?.toLowerCase().includes("dana.id") ||
        data?.chat?.toLowerCase().includes("shope.ee") ||
        data?.chat?.toLowerCase().includes("sppay")

      const minta = data?.chat?.toLocaleLowerCase().includes("dana.id/qr") || data?.chat?.toLocaleLowerCase().includes("dana.id/minta")

      if (daget && !minta && !data.isMe) msgChecker(data)

      config.count++
    })
  } catch (error) {
    console.log({ error, msg: "# ERROR ON MAIN PROCESS" })
  }
}

main()

const temmy = { name: "Temmy ", token: "6612064106:AAGmoEXZGq6p0GgPLl8jUg5sF0xHSo8frbo" }
const temmyBot = new Telegraf(temmy.token)

temmyBot.command("test", async (ctx) => {
  try {
    await ctx.reply(bot[config.botIndex].name.toUpperCase() + " SIAPP !!!", {
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: `SEBANYAK ${config.count} PESAN SUDAH ${bot[config.botIndex].name.toUpperCase()} PANTAU`, callback_data: "late" }],
        ],
      },
    })
    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
  } catch (error) {
    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
    console.log({ error, msg: "ERROR ON PROCESS COMMAND KUMANG" })
  }
})

temmyBot.launch()

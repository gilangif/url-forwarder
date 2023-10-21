const { Telegraf } = require("telegraf")
const whatsapp = require("wa-multi-session")
const whitelist = require("./data/whatsapp.json")
const fs = require("fs")

let logfile = "./data/log.json"
let logs = require(logfile)

let allgroup = {}
let group = { opank: "-1001962626950", oyen: "-1001909548840" }
let process = { logs: 20, count: 0, blacklistSend: true }

let bot = {
  amon: "6330855133:AAEhvPiovs-QJ8mMyACHdam0j76J76fk-W0",
  kumang: "6659028719:AAFW_J7nr_KDHhC4QZfAmbM1Ozirg5P3QXs",
  yuli: "6694843798:AAEHQChaaGX1HyK3kZUXnaLoweK6yVcm394",
  opank: "6516245543:AAEPXLHDut-6tyRQNIj7cqxqVVdoGfet1Es",
  oyen: "6293865566:AAGZQgNcYU3HmnmYw3V-B2DkWu7z_-WmGxo",
}

const kumang = new Telegraf(bot.kumang)

function timestamp(x) {
  const date = new Date(x)

  const daysOfWeek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

  const day = daysOfWeek[date.getDay()]
  const dayOfMonth = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })

  const formattedText = `${time} | ${day}, ${dayOfMonth} ${month} ${year}`
  return formattedText
}

const telegram = async (data, botgroup, status) => {
  try {
    if (status || status === "custom") {
      await kumang.telegram.sendMessage(botgroup, data)
    } else {
      await kumang.telegram.sendMessage(
        botgroup,
        `${data.chat}\n\n📌 process ${process.count}\n🕹️ ${data.groupname.toLowerCase().trim()}\n🙇‍♂️ ${data.name.toLowerCase().trim()}`,
        {
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: data?.group?.toUpperCase(), callback_data: "late" }]],
          },
        }
      )
    }
  } catch (error) {
    console.log({ error, msg: "ERROR ON FUNCTION TELEGRAM" })
  }
}

const sendMsg = async (data) => {
  try {
    await kumang.telegram.sendChatAction(group.opank, "typing")

    if (logs.length > process.logs) logs = []

    if (group[data.from] && !logs.find((x) => x.chat === data.chat)) {
      await telegram(data, group.opank)
      data.status = true

      logs.push(data)
      fs.writeFileSync(logfile, JSON.stringify(logs, null, 2))
    } else {
      if (process.blacklistSend) {
        await telegram(data, group.oyen)
        data.status = true
        data.info = "OYENNNN"

        logs.push(data)
        fs.writeFileSync(logfile, JSON.stringify(logs, null, 2))
      }
    }

    console.log(data)
  } catch (error) {
    console.log({ error, msg: "ERROR ON FUNCTION SENDMSG" })
  }
}

const main = async () => {
  try {
    console.log("# Start")

    const session = await whatsapp.startSession("mysessionid")

    for (x of whitelist) {
      if (!x.blacklist) {
        group[x.from] = x.name
      }
    }

    for (x of whitelist) {
      allgroup[x.from] = x.name
    }

    whatsapp.onConnected(async (sessionId) => {
      console.log("# Connected")
      telegram(`# START SERVICES\n    ${timestamp(new Date())}\n\n# SEND BLACKLIST: ${process.blacklistSend}`, group.oyen, "custom")
    })

    whatsapp.onMessageReceived(async (msg) => {
      const data = {
        process: process.count,
        name: msg?.pushName,
        from: msg?.key?.remoteJid,
        participant: msg?.key?.participant,
        chat: msg?.message?.extendedTextMessage?.text || msg?.message?.conversation,
        sessionId: msg.sessionId,
        groupname: allgroup[msg?.key?.remoteJid] || "UNKNOWN GROUP, PERSONAL OR STORY",
        group: group[msg?.key?.remoteJid] || "BLACKLIST",
        timestamp: timestamp(new Date()),
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
  } catch (error) {
    console.log({ error, msg: "# ERROR ON MAIN PROCESS" })
  }
}

kumang.command("kumang", async (ctx) => {
  try {
    await ctx.reply("JJ SIAPP !!!", {
      reply_markup: {
        inline_keyboard: [[{ text: `SEBANYAK ${process.count} PESAN SUDAH JJ PANTAU`, callback_data: "late" }]],
      },
    })
  } catch (error) {
    console.log({ error, msg: "ERROR ON PROCESS COMMAND KUMANG" })
  }
})

kumang.command("blacklist", async (ctx) => {
  try {
    process.blacklistSend ? (process.blacklistSend = false) : (process.blacklistSend = true)
    await ctx.reply(`# SEND BLACKLIST: ${process.blacklistSend}`)
  } catch (error) {
    console.log({ error, msg: "ERROR ON PROCESS COMMAND KUMANG" })
  }
})

kumang.launch()

main()

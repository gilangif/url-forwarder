const whatsapp = require("wa-multi-session")
const fs = require("fs")

let logsFile = "./logs/logs.json"

let logs = require(logsFile)
let groups = require("./data/whatsapp.json")

let config = { count: 0, logs: 100, target: "6281295026951" }

const msgChecker = async (data) => {
  try {
    whatsapp.sendTyping({ sessionId: data.sessionId, to: config.target, duration: 500, isGroup: false })

    if (logs.length > config.logs) logs = []

    if (config.group[data.from] && !logs.find((x) => x.chat === data.chat)) {
      const text = `${data.chat.trim()}\n\n\n😹 PROCESS ${config.count}x\n😻 ${data.groupname}\n😺 ${data.name}`

      whatsapp.sendTextMessage({ sessionId: data.sessionId, to: config.target, text, isGroup: false })
      logs.push(data)
      fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2))
    }

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

    whatsapp.onConnected(async (sessionId) => console.log("# Connected\n\n"))

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

      count++
      config.count++
    })
  } catch (error) {
    console.log({ error, msg: "# ERROR ON MAIN PROCESS" })
  }
}

main()

// whatsapp.sendTextMessage({
//   sessionId: sessionId,
//   to: "120363194825458313@g.us",
//   text: "Halo hay nbay bay",
//   isGroup: true,
// })

const { Connection, Config } = require("zwa")

const config = Config({
  showLogs: true,
  dir: "session",
  prefix: "/",
  authors: [],
  banned: [],
  browser: ["ZWA MD", "Safari", "3.0.0"],
})

const connect = async () => {
  const ZWA = new Connection({ config })
  await ZWA.initial(connect)

  ZWA.on("connection", ({ status }) => {
    if (status == "open") {
    }
  })

  ZWA.on("messages", async (msg) => {
    const { message, command } = msg
    if (command == "tes") return ZWA.sendText("Tester ...")
    if (message == "Hallo") return ZWA.sendText("Hai!")
  })

  ZWA.on("messages.delete", async (msg) => {})

  ZWA.on("call", async (msg) => {})

  ZWA.on("update.status", async (msg) => {})
}

connect()

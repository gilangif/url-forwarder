const whatsapp = require("wa-multi-session")
const fs = require("fs")

let saveSessionId

const main = async () => {
  try {
    const session = await whatsapp.startSession("mysessionid")

    whatsapp.onConnected(async (sessionId) => {
      console.log("📌 sessionId: ", sessionId)
      console.log("# Connected")

      saveSessionId = sessionId
    })

    whatsapp.onMessageReceived(async (msg) => {
      console.log("📌 sessionId: ", msg.sessionId)
      await whatsapp.sendTextMessage({
        sessionId: msg.sessionId,
        to: "120363194825458313@g.us",
        text: "Hi There, This is Message from Server!",
      })
    })
  } catch (error) {
    console.log({ error, msg: "# ERROR ON MAIN PROCESS" })
  }
}

main()

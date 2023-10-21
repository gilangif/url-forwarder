const venom = require("venom-bot")

venom
  .create({
    session: "session-name", //name of session
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro)
  })

function start(client) {
  client.onMessage((message) => {
    console.log(message)
  })
}


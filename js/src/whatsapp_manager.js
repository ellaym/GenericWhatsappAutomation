const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { handleMessage } = require("./handle_message.js");
const { loadJsonFile } = require("./db_handler.js");
const wwebVersion = '2.2412.54';
const url_to_fix_whatsappwebjs_bug = `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`

async function main() {
  const client = new Client({
    authStrategy: new LocalAuth(),
    webVersionCache: {
      type: 'remote',
      remotePath: url_to_fix_whatsappwebjs_bug,
    },
  });
  let config = {};

  try {
    config = await loadJsonFile("config/config.json");
  } catch (error) {
    console.error("Failed to load the JSON file:", error);
    return -1;
  }

  if (!("chat_id" in config)) {
    console.log("Config file should contain the chat_id field");
    return -1;
  }

  client.on("qr", (qr) => {
    console.log(qr)
    qrcode.generate(qr, { small: true });
  });

  client.on("message", async msg => {
    if (msg.from === config.chat_id) {  // Replace with your actual chat ID
        try {
            await handleMessage(msg);
        } catch (error) {
            console.error("Error handling message:", error);
        }
    }
});

  client.initialize();
}

main().catch(console.error);

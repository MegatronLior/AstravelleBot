import express from "express";
import { Client, GatewayIntentBits } from "discord.js";

// Serveur web pour keep-alive
const app = express();
app.get("/", (req, res) => res.send("Bot en ligne !"));
app.listen(3000, () => console.log("✅ Serveur actif"));

// Bot Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once("ready", () => {
  console.log(`🤖 Connecté en tant que ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.content === "!ping") message.reply("Pong 🏓");
});

client.login(process.env.TOKEN);

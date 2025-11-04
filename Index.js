import express from "express";
import { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";

// ------------------ Express pour keep-alive ------------------
const app = express();
app.get("/", (req, res) => res.send("Bot en ligne !"));
app.listen(3000, () => console.log("✅ Serveur actif"));

// ------------------ Configuration Discord ------------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ------------------ Variables ------------------
const CENTRAL_CHANNEL_ID = "1435086064456040518";   // Salon du message central
const CENTRAL_MESSAGE_ID = "1435147490054766745";   // Message central
const pendingRequests = new Map();                  // Stocke les demandes en attente

// ------------------ Fonction embed central ------------------
function createCentralEmbed(embedData = {}) {
  const embed = new EmbedBuilder()
    .setColor("#8B4513") // Marron
    .setTitle("🏰 Astravelle – Liste Administrative & Professeurs")
    .setDescription("\u200B") // ligne vide pour espacement
    .addFields(
      { name: "𝐀𝐃𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐓𝐈𝐎𝐍", value:
        embedData.ADMIN ?? 
        "Directeur :\nDirecteur adjoint :\nSecrétaire :\nTrésorier :\nInfirmier(e)s :\nInfirmier(e)s :\nResponsable admissions :\nBibliothécaire en chef :\nSexologue :\nPsychologue :\nPsychologue : Libre\n\u200B"
      },
      { name: "𝐏𝐑𝐎𝐅𝐄𝐒𝐒𝐄𝐔𝐑𝐒", value:
        embedData.PROF ?? 
        "Philosophie :\nMythologie comparées :\nCoréen :\nMalédictions et contre-sorts :\nArt :\nMagie astrales :\n\u200B"
      },
      { name: "𝐒𝐔𝐑𝐕𝐄𝐈𝐋𝐋𝐀𝐍𝐓𝐒 • 𝐒𝐄́𝐂𝐔𝐑𝐈𝐓𝐄́", value:
        embedData.SURV ?? "surveillant :\nsurveillant :\n\u200B"
      },
      { name: "𝐄𝐍𝐓𝐑𝐄𝐓𝐈𝐄𝐍𝐒 • 𝐀𝐔𝐓𝐑𝐄𝐒", value:
        embedData.OTHER ?? "... : ...\n\u200B"
      }
    )
    .setFooter({ text: "Astravelle • Géré par le staff" })
    .setTimestamp();
  return embed;
}

// ------------------ Commande pour demander un rôle ------------------
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!demander")) {
    const roleName = message.content.slice("!demander".length).trim();
    if (!roleName) return message.reply("❌ Tu dois préciser le rôle.");

    if (pendingRequests.has(message.author.id)) {
      return message.reply("❌ Tu as déjà une demande en attente !");
    }

    pendingRequests.set(message.author.id, roleName);

    // Crée les boutons Accepter / Refuser pour le staff
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`accept_${message.author.id}`)
        .setLabel("Accepter")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`deny_${message.author.id}`)
        .setLabel("Refuser")
        .setStyle(ButtonStyle.Danger)
    );

    // Envoie la demande dans le salon central ou staff
    const staffChannel = await message.guild.channels.fetch(CENTRAL_CHANNEL_ID);
    staffChannel.send({
      content: `🆕 Nouvelle demande : **${roleName}** par ${message.author}`,
      components: [row]
    });

    message.reply("✅ Ta demande a été envoyée au staff !");
  }
});

// ------------------ Interaction boutons ------------------
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const [action, userId] = interaction.customId.split("_");
  const user = await interaction.guild.members.fetch(userId);
  const roleName = pendingRequests.get(userId);
  if (!roleName) return interaction.reply({ content: "Cette demande n'existe plus.", ephemeral: true });

  // Récupère le message central
  const channel = await client.channels.fetch(CENTRAL_CHANNEL_ID);
  const centralMessage = await channel.messages.fetch(CENTRAL_MESSAGE_ID);

  // On récupère l’embed existant
  const oldEmbed = centralMessage.embeds[0];
  const embedData = {
    ADMIN: oldEmbed.fields[0]?.value,
    PROF: oldEmbed.fields[1]?.value,
    SURV: oldEmbed.fields[2]?.value,
    OTHER: oldEmbed.fields[3]?.value
  };

  if (action === "accept") {
    // Ajouter la mention @ dans le champ correspondant
    let mention = `<@${userId}>`;

    if (roleName.toLowerCase().includes("prof")) {
      embedData.PROF += `\n- ${roleName} : ${mention}`;
    } else if (roleName.toLowerCase().includes("admin") || roleName.toLowerCase().includes("directeur") || roleName.toLowerCase().includes("infirmier") || roleName.toLowerCase().includes("responsable") || roleName.toLowerCase().includes("bibliothécaire") || roleName.toLowerCase().includes("sexologue") || roleName.toLowerCase().includes("psychologue") || roleName.toLowerCase().includes("trésorier") || roleName.toLowerCase().includes("secrétaire")) {
      embedData.ADMIN += `\n- ${roleName} : ${mention}`;
    } else if (roleName.toLowerCase().includes("surveillant")) {
      embedData.SURV += `\n- ${roleName} : ${mention}`;
    } else {
      embedData.OTHER += `\n- ${roleName} : ${mention}`;
    }

    pendingRequests.delete(userId);
    await centralMessage.edit({ embeds: [createCentralEmbed(embedData)] });
    await interaction.reply({ content: `✅ Demande de ${user} acceptée !`, ephemeral: true });
  } else if (action === "deny") {
    pendingRequests.delete(userId);
    await interaction.reply({ content: `❌ Demande de ${user} refusée.`, ephemeral: true });
  }
});

// ------------------ Lancement du bot ------------------
client.once("ready", () => {
  console.log(`🤖 Connecté en tant que ${client.user.tag}`);
});

client.login(process.env.TOKEN);

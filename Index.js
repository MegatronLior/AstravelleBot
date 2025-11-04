import { EmbedBuilder } from "discord.js";

function createCentralEmbed(content = "") {
  const embed = new EmbedBuilder()
    .setColor("#8B4513") // Marron
    .setTitle("🏰 Astravelle – Liste Administrative & Professeurs")
    .setDescription("\u200B") // ligne vide pour espacement
    .addFields(
      { name: "𝐀𝐃𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐓𝐈𝐎𝐍", value:
        "Directeur :\n" +
        "Directeur adjoint :\n" +
        "Secrétaire :\n" +
        "Trésorier :\n" +
        "Infirmier(e)s :\n" +
        "Infirmier(e)s :\n" +
        "Responsable admissions :\n" +
        "Bibliothécaire en chef :\n" +
        "Sexologue :\n" +
        "Psychologue :\n" +
        "Psychologue : Libre\n\u200B"
      },
      { name: "𝐏𝐑𝐎𝐅𝐄𝐒𝐒𝐄𝐔𝐑𝐒", value:
        "Philosophie :\n" +
        "Mythologie comparées :\n" +
        "Coréen :\n" +
        "Malédictions et contre-sorts :\n" +
        "Art :\n" +
        "Magie astrales :\n\u200B"
      },
      { name: "𝐒𝐔𝐑𝐕𝐄𝐈𝐋𝐋𝐀𝐍𝐓𝐒 • 𝐒𝐄́𝐂𝐔𝐑𝐈𝐓𝐄́", value:
        "surveillant :\n" +
        "surveillant :\n\u200B"
      },
      { name: "𝐄𝐍𝐓𝐑𝐄𝐓𝐈𝐄𝐍𝐒 • 𝐀𝐔𝐓𝐑𝐄𝐒", value:
        "... : ...\n\u200B"
      }
    )
    .setFooter({ text: "Astravelle • Géré par le staff" })
    .setTimestamp();

  return embed;
}

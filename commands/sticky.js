const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js")
const StickyModel = require("../models/StickyModel")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sticky")
    .setDescription("Postavi sticky poruku 📌")
    .addChannelOption((option) => option.setName("kanal").setDescription("Kanal za sticky poruku").setRequired(true))
    .addStringOption((option) => option.setName("poruka").setDescription("Sadržaj sticky poruke").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction, client) {
    const channel = interaction.options.getChannel("kanal")
    const message = interaction.options.getString("poruka")

    if (channel.type !== 0) {
      return interaction.reply({ content: "Molimo izaberite validan tekstualni kanal. 🚫", ephemeral: true })
    }

    const existingSticky = await StickyModel.findOne({ guildId: interaction.guildId, channelId: channel.id })

    if (existingSticky) {
      existingSticky.message = message
      await existingSticky.save()
    } else {
      const newSticky = new StickyModel({
        guildId: interaction.guildId,
        channelId: channel.id,
        message: message,
      })
      await newSticky.save()
    }

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("sticky_options")
        .setPlaceholder("Izaberite opciju")
        .addOptions([
          {
            label: "Uredi poruku",
            description: "Izmeni sadržaj sticky poruke",
            value: `edit_${channel.id}`,
            emoji: "✏️",
          },
          {
            label: "Obriši sticky",
            description: "Ukloni sticky poruku iz kanala",
            value: `delete_${channel.id}`,
            emoji: "🗑️",
          },
        ]),
    )

    const embed = new EmbedBuilder()
      .setColor("#f1c40f")
      .setTitle("📌 Sticky Poruka")
      .setDescription(message)
      .setTimestamp()
      .setFooter({ text: "Kreirao Spacevin", iconURL: client.user.displayAvatarURL() })

    client.on("messageCreate", async (msg) => {
      if (msg.channelId === channel.id && !msg.author.bot) {
        const stickyMessage = await StickyModel.findOne({ guildId: msg.guildId, channelId: msg.channelId })
        if (stickyMessage) {
          const messages = await msg.channel.messages.fetch({ limit: 10 })
          const existingSticky = messages.find(
            (m) => m.author.id === client.user.id && m.embeds[0]?.title === "📌 Sticky Poruka",
          )
          if (existingSticky) {
            await existingSticky.delete()
          }
          await msg.channel.send({ embeds: [embed], components: [menu] })
        }
      }
    })

    await interaction.reply({ content: `Sticky poruka postavljena u ${channel}! 📌`, ephemeral: true })
  },
}

console.log("🌟 Sticky command created by Spacevin")


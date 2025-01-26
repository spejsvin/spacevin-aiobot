const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vouchconfig")
    .setDescription("Konfiguriši podešavanja voucha 🛠️")
    .addChannelOption((option) => option.setName("kanal").setDescription("Kanal za voucheve").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const channel = interaction.options.getChannel("kanal")

    if (channel.type !== 0) {
      return interaction.reply({ content: "Molimo izaberite validan tekstualni kanal. 🚫", ephemeral: true })
    }

    client.vouchConfig.set(interaction.guildId, {
      channelId: channel.id,
    })

    const embed = new EmbedBuilder()
      .setColor("#3498db")
      .setTitle("🛠️ Konfiguracija Voucha")
      .setDescription("Podešavanja voucha su uspešno ažurirana!")
      .addFields({ name: "Kanal za Voucheve", value: channel.toString(), inline: true })
      .setTimestamp()
      .setFooter({ text: "Kreirao Spacevin", iconURL: client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed], ephemeral: true })
  },
}

console.log("🌟 Vouchconfig command created by Spacevin")


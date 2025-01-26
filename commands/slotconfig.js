const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slotconfig")
    .setDescription("Konfiguriši podešavanja slotova 🛠️")
    .addChannelOption((option) =>
      option.setName("kategorija").setDescription("Kategorija za kanale slotova").setRequired(true),
    )
    .addRoleOption((option) =>
      option.setName("uloga").setDescription("Uloga koja može da kreira slotove").setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const category = interaction.options.getChannel("kategorija")
    const role = interaction.options.getRole("uloga")

    if (category.type !== 4) {
      return interaction.reply({ content: "Molimo izaberite validnu kategoriju kanala. 🚫", ephemeral: true })
    }

    client.slotConfig.set(interaction.guildId, {
      categoryId: category.id,
      roleId: role.id,
    })

    const embed = new EmbedBuilder()
      .setColor("#2ecc71")
      .setTitle("🛠️ Konfiguracija Slotova")
      .setDescription("Podešavanja slotova su uspešno ažurirana!")
      .addFields(
        { name: "Kategorija", value: category.name, inline: true },
        { name: "Uloga", value: role.name, inline: true },
      )
      .setTimestamp()
      .setFooter({ text: "Kreirao Spacevin", iconURL: client.user.displayAvatarURL() })

    await interaction.reply({ embeds: [embed], ephemeral: true })
  },
}

console.log("🌟 Slotconfig command created by Spacevin")


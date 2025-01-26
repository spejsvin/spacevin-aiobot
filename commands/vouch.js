const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const { createCanvas, loadImage } = require("canvas")
const VouchModel = require("../models/VouchModel")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vouch")
    .setDescription("Dodaj vouch za korisnika 👍")
    .addUserOption((option) =>
      option.setName("korisnik").setDescription("Korisnik za kojeg dajete vouch").setRequired(true),
    )
    .addStringOption((option) => option.setName("proizvod").setDescription("Proizvod ili usluga").setRequired(true))
    .addStringOption((option) => option.setName("detalji").setDescription("Dodatni detalji").setRequired(true))
    .addIntegerOption((option) =>
      option
        .setName("ocena")
        .setDescription("Ocena (1-5 zvezdica)")
        .setRequired(true)
        .addChoices(
          { name: "1 Zvezdica", value: 1 },
          { name: "2 Zvezdice", value: 2 },
          { name: "3 Zvezdice", value: 3 },
          { name: "4 Zvezdice", value: 4 },
          { name: "5 Zvezdica", value: 5 },
        ),
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser("korisnik")
    const product = interaction.options.getString("proizvod")
    const details = interaction.options.getString("detalji")
    const rating = interaction.options.getInteger("ocena")

    const guildId = interaction.guildId
    const config = client.vouchConfig.get(guildId) || { channelId: null }

    if (!config.channelId) {
      return interaction.reply({
        content: "Vouch kanal nije postavljen. Molimo koristite /vouchconfig prvo. 🛠️",
        ephemeral: true,
      })
    }

    if (interaction.channelId !== config.channelId) {
      return interaction.reply({
        content: `Ovu komandu možete koristiti samo u određenom vouch kanalu. 🚫`,
        ephemeral: true,
      })
    }

    const vouchCount = (await VouchModel.countDocuments({ guildId: guildId })) + 1

    const vouch = new VouchModel({
      guildId: guildId,
      userId: user.id,
      voucherId: interaction.user.id,
      product: product,
      details: details,
      rating: rating,
      vouchNumber: vouchCount,
    })

    await vouch.save()

    const canvas = createCanvas(800, 400)
    const ctx = canvas.getContext("2d")

    const gradient = ctx.createLinearGradient(0, 0, 800, 400)
    gradient.addColorStop(0, "#2ecc71")
    gradient.addColorStop(1, "#3498db")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 400)

    ctx.font = "40px Arial"
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.fillText(`Vouch #${vouchCount} 🌟`, 400, 60)

    ctx.font = "30px Arial"
    ctx.fillText(`Za: ${user.tag}`, 400, 120)
    ctx.fillText(`Proizvod: ${product}`, 400, 180)
    ctx.fillText(`Ocena: ${"⭐".repeat(rating)}`, 400, 240)

    ctx.font = "20px Arial"
    ctx.fillText(`Detalji: ${details}`, 400, 300)
    ctx.fillText(`Vouch dao: ${interaction.user.tag}`, 400, 350)

    const attachment = { attachment: canvas.toBuffer(), name: "vouch-info.png" }

    const embed = new EmbedBuilder()
      .setColor("#2ecc71")
      .setTitle(`Vouch #${vouchCount} 🌟`)
      .setDescription(
        `**Za:** ${user}\n**Proizvod:** ${product}\n**Ocena:** ${"⭐".repeat(rating)}\n**Detalji:** ${details}`,
      )
      .setImage("attachment://vouch-info.png")
      .setTimestamp()
      .setFooter({ text: `Vouch dao: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })

    await interaction.reply({ content: `Vouch #${vouchCount} uspešno dodat! 🎉`, embeds: [embed], files: [attachment] })
  },
}

console.log("🌟 Vouch command created by Spacevin")


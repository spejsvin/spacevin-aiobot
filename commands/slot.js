const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js")
const { createCanvas, loadImage } = require("canvas")
const SlotModel = require("../models/SlotModel")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slot")
    .setDescription("Kreiraj novi slot 🎰")
    .addUserOption((option) => option.setName("vlasnik").setDescription("Vlasnik slota").setRequired(true))
    .addIntegerOption((option) => option.setName("trajanje").setDescription("Trajanje u danima").setRequired(true))
    .addIntegerOption((option) =>
      option.setName("pingovi").setDescription("Broj everyone/here pingova").setRequired(true),
    )
    .addStringOption((option) => option.setName("ime").setDescription("Ime slota").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {
    const owner = interaction.options.getUser("vlasnik")
    const duration = interaction.options.getInteger("trajanje")
    const pings = interaction.options.getInteger("pingovi")
    const name = interaction.options.getString("ime")

    const guildId = interaction.guildId
    const config = client.slotConfig.get(guildId) || { categoryId: null, roleId: null }

    if (!config.categoryId || !config.roleId) {
      return interaction.reply({
        content: "Konfiguracija slotova nije postavljena. Molimo koristite /slotconfig prvo. 🛠️",
        ephemeral: true,
      })
    }

    if (!interaction.member.roles.cache.has(config.roleId)) {
      return interaction.reply({ content: "Nemate dozvolu za kreiranje slotova. 🚫", ephemeral: true })
    }

    const channel = await interaction.guild.channels.create({
      name: name,
      type: 0,
      parent: config.categoryId,
    })

    const slot = new SlotModel({
      guildId: guildId,
      channelId: channel.id,
      ownerId: owner.id,
      name: name,
      duration: duration,
      pings: pings,
      createdAt: new Date(),
    })

    await slot.save()

    const canvas = createCanvas(800, 400)
    const ctx = canvas.getContext("2d")

    const gradient = ctx.createLinearGradient(0, 0, 800, 400)
    gradient.addColorStop(0, "#3498db")
    gradient.addColorStop(1, "#8e44ad")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 400)

    ctx.font = "40px Arial"
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.fillText(`Novi Slot: ${name} 🎉`, 400, 100)

    ctx.font = "30px Arial"
    ctx.fillText(`Vlasnik: ${owner.tag}`, 400, 180)
    ctx.fillText(`Trajanje: ${duration} dana`, 400, 240)
    ctx.fillText(`Pingovi: ${pings}`, 400, 300)

    const attachment = { attachment: canvas.toBuffer(), name: "slot-info.png" }

    const embed = new EmbedBuilder()
      .setColor("#3498db")
      .setTitle(`🎰 Pravila Slota: ${name}`)
      .setDescription(`
1. Poštujte vlasnika slota i ostale članove.
2. Bez spamovanja ili preteranog pingovanja.
3. Sadržaj mora biti primeren za sve i pratiti pravila servera.
4. Vlasnik slota ima ${pings} everyone/here pingova na raspolaganju.
5. Ovaj slot će biti aktivan ${duration} dana.

Uživajte u svom slotu, ${owner}! 🥳
      `)
      .setImage("attachment://slot-info.png")
      .setTimestamp()
      .setFooter({ text: "Kreirao Spacevin", iconURL: client.user.displayAvatarURL() })

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("accept_rules")
        .setLabel("Prihvatam pravila")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("✅"),
      new ButtonBuilder()
        .setCustomId("reject_rules")
        .setLabel("Ne prihvatam pravila")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("❌"),
    )

    await channel.send({ embeds: [embed], files: [attachment], components: [buttons] })
    await interaction.reply({ content: `Slot uspešno kreiran! Pogledajte ${channel} 🎊`, ephemeral: true })
  },
}

console.log("🌟 Slot command created by Spacevin")


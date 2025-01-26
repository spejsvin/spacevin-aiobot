const { Client, GatewayIntentBits, Collection, ActivityType, REST, Routes } = require("discord.js")
const { config } = require("dotenv")
const fs = require("fs")
const mongoose = require("mongoose")
const VouchModel = require("./models/VouchModel")
const SlotModel = require("./models/SlotModel")
const StickyModel = require("./models/StickyModel")

const GUILD_ID = ""
const CLIENT_ID = ""

config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
})

client.commands = new Collection()
client.slotConfig = new Collection()
client.vouchConfig = new Collection()

const commands = []
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command)
    commands.push(command.data.toJSON())
    console.log(`Loaded command: ${command.data.name}`)
  } else {
    console.log(`[WARNING] The command ${file} is missing a required "data" or "execute" property.`)
  }
}

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
    })
    console.log("🎉 Successfully connected to MongoDB")
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error)
    process.exit(1)
  }
}

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN)

  try {
    console.log("Started refreshing application (/) commands.")

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })

    console.log("Successfully reloaded application (/) commands.")
  } catch (error) {
    console.error("Error registering commands:", error)
  }
}

client.once("ready", async () => {
  console.log(`🚀 Logged in as ${client.user.tag}`)

  await connectToDatabase()
  await registerCommands()

  const guild = await client.guilds.fetch(GUILD_ID)

  const updateStatus = async () => {
    try {
      const vouchCount = await VouchModel.countDocuments({ guildId: GUILD_ID })
      const slotCount = await SlotModel.countDocuments({ guildId: GUILD_ID })
      const stickyCount = await StickyModel.countDocuments({ guildId: GUILD_ID })

      client.user.setActivity(
        `📊 ${guild.memberCount} članova | ${slotCount} slotova | ${vouchCount} vouch-eva | ${stickyCount} sticky`,
        { type: ActivityType.Watching },
      )
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  await updateStatus()
  setInterval(updateStatus, 5 * 60 * 1000) // Update every 5 minutes
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand() && !interaction.isButton() && !interaction.isStringSelectMenu()) return

  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName)

    if (!command) return

    try {
      await command.execute(interaction, client)
    } catch (error) {
      console.error(error)
      await interaction.reply({ content: "Došlo je do greške pri izvršavanju ove komande! 😔", ephemeral: true })
    }
  } else if (interaction.isButton()) {
    // Handle button interactions
    if (interaction.customId === "accept_rules") {
      await interaction.reply({ content: "Hvala što ste prihvatili pravila! 🎉", ephemeral: true })
    } else if (interaction.customId === "reject_rules") {
      await interaction.reply({ content: "Žao nam je što ne prihvatate pravila. 😔", ephemeral: true })
    }
  } else if (interaction.isStringSelectMenu()) {
    // Handle select menu interactions
    if (interaction.customId === "sticky_options") {
      const [action, channelId] = interaction.values[0].split("_")
      if (action === "edit") {
        // Implement editing sticky message
        await interaction.reply({ content: "Molimo unesite novu poruku:", ephemeral: true })
      } else if (action === "delete") {
        await StickyModel.findOneAndDelete({ guildId: interaction.guildId, channelId: channelId })
        await interaction.reply({ content: "Sticky poruka je obrisana. 🗑️", ephemeral: true })
      }
    }
  }
})

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason)
})

client.login(process.env.DISCORD_TOKEN)

console.log("🌟 Bot created by Spacevin")


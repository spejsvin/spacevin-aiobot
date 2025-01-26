const mongoose = require("mongoose")

const StickySchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Sticky", StickySchema)

console.log("🌟 Sticky model created by Spacevin")


const mongoose = require("mongoose")

const SlotSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  ownerId: { type: String, required: true },
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  pings: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
})

module.exports = mongoose.model("Slot", SlotSchema)

console.log("🌟 Slot model created by Spacevin")


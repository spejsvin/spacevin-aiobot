const mongoose = require("mongoose")

const VouchSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  voucherId: { type: String, required: true },
  product: { type: String, required: true },
  details: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  vouchNumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Vouch", VouchSchema)

console.log("🌟 Vouch model created by Spacevin")


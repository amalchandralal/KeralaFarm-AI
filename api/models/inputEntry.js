const mongoose = require('mongoose')

const InputEntrySchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:     { type: String, required: true },
  category: { type: String, enum: ['fertilizer','pesticide','labor','seed','equipment','other'], required: true },
  item:     { type: String, required: true },
  quantity: { type: String, default: '' },
  unit:     { type: String, default: 'kg' },
  cost:     { type: Number, required: true },
  notes:    { type: String, default: '' },
}, { timestamps: true })

module.exports = mongoose.model('InputEntry', InputEntrySchema)
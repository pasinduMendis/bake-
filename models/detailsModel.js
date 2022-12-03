const mongoose = require('mongoose')

const detailsSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  company_id: String,
  description: String,
  type: String,
  year: Number,
  month: Number,
  date: Number,
  amount: Number,
})

module.exports = mongoose.model('Details', detailsSchema)

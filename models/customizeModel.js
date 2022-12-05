const mongoose = require('mongoose')

const cutomizeSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  customize_id: { type: String, required: true },
  title: { type: String, required: true },
  variation:[{name:{type: String, required: true},
  price: { type: String, required: true },variation_id: { type: String, required: true }}],
})

module.exports = mongoose.model('Customize', cutomizeSchema)

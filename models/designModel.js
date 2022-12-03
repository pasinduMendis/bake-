const mongoose = require('mongoose')

const designSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  design_id: { type: String, required: true },
  description: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: [], required: true },
  variation: { type: [{size:{type: String, required: true},price:{type: String, required: true}}], required: true },
  customize:{type:[{customize_id:{type: String, required: true},available_options:{type: [], required: true}}]},
  discount_presentage:{type:String,required:false,default:0}
})

module.exports = mongoose.model('Design', designSchema)

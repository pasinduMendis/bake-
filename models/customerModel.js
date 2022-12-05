const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  customer_id:{ type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  nic:{ type: String, required: true },
  customer_address:{ type: String, required: true },
  customer_contact:{ type: String, required: true },
  favorites:{ type: [], required: false,default: [] },
  cart:{ type: [{
    design_id:{ type: String, required: false },
    size:{ type: String, required: false },
    qty:{ type: Number, required: false },
    customize:[]
  }], required: false,default: [] },
  isAdmin:{ type: Boolean, required: false,default:false },
})

module.exports = mongoose.model('Customers', customerSchema)

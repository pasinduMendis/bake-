const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const PORT = 4000
const cors = require('cors')
const mongoose = require('mongoose')
const dataBase = require('./database.js')
const customerRoutes = require('./routes/customerRoutes')
const customizeRoute = require('./routes/customizeRoute')
const designRoutes = require('./routes/designRoutes.js')
const cartRoutes = require('./routes/cart.js')

mongoose
  .connect(dataBase.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    () => {
      console.log('Database is successfully connected')
    },
    (err) => {
      console.log('cannont connect to the database' + err)
    }
  )

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())
app.use('/customer', customerRoutes)
app.use('/design', designRoutes)
app.use('/cart',cartRoutes)
app.use('/customize',customizeRoute)

app.listen(PORT, function () {
  console.log('saver is running on :', PORT)
})

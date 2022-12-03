const express = require('express')
const dataRoutes = express.Router()
const Details = require('../models/detailsModel')

dataRoutes.post('/add', async (req, res) => {
  const data = new Details(req.body)
  data
    .save()
    .then(() => {
      res.send('successfully added')
    })
    .catch((err) => res.send('failed'))
})

dataRoutes.get('/check/:id/:year/:month', async (req, res) => {
  const findId = await Details.find({
    year: req.params.year,
    company_id: req.params.id,
    month: req.params.month,
    //admin_password: req.params.password,
  })

  res.send(findId)
})

module.exports = dataRoutes

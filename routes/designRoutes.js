const express = require('express')
const designRoutes = express.Router()
const Design = require('../models/designModel')
const jwt=require("jsonwebtoken")

const adminverify=async (token)=>{
    try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET
        )
        console.log(decoded.id)
        body=decoded.id
        if (!decoded) {
          return false;
        }else{
            const idVrify=await Design.findOne({customer_id:decoded.id.customer_id,isAdmin:true}).catch((err) => {
                console.log(err);
                return false;
              });
              if(idVrify){
                return true;
              }
              return false;
        }
      } catch (error) {
        return false;
      }
}

designRoutes.post('/add', async (req, res) => {
    //need to add admin verification
    if(!req.query.token){
        res.send("admin token must needed!")
        return
    }
    const isAdminTest=await adminverify(req.query.token)
    console.log(isAdminTest)
    if(!isAdminTest){
        res.send("failed!")
        return;
    }
    const idVrify=await Design.findOne({design_id:req.body.design_id}).catch((err) => {
        console.log(err);
        res.json("failed");
        return;
      });
      if(idVrify){
        res.send("design_id already exist.")
        return;
      }
  const data = new Design(req.body)
  await data
    .save()
    .then(() => {
      res.send('successfully added')
    })
    .catch((err) => res.send('failed'))
})

//get all designs
designRoutes.get('/allDesign', async (req, res) => {
  const allDesigns = await Design.find({}).catch((err) => {
    console.log(err);
    res.json("failed");
    return;
  });

  res.send(allDesigns)
})

//get relavent design
designRoutes.get('/:id', async (req, res) => {
    const relevantDesigns = await Design.findOne({design_id:req.params.id}).catch((err) => {
      console.log(err);
      res.json("failed");
      return;
    });
  
    res.send(relevantDesigns)
  })

  designRoutes.put('/update/:id', async (req, res) => {
    if(!req.query.token){
        res.send("admin token must needed!")
        return
    }
    const isAdminTest=await adminverify(req.query.token)
    console.log(isAdminTest)
    if(!isAdminTest){
        res.send("failed!")
        return;
    }

    const idVrify=await Design.findOne({design_id:req.body.design_id}).catch((err) => {
        console.log(err);
        res.json("failed");
        return;
      });
      if(idVrify){
        res.send("design_id already exist.")
        return;
      }
    const relevantDesigns = await Design.findOneAndUpdate({design_id:req.params.id},{$set:req.body}).catch((err) => {
      console.log(err);
      res.json("failed");
      return;
    });
  
    res.send("succefully updated!")
  })

  designRoutes.delete('/delete/:id', async (req, res) => {

    if(!req.query.token){
        res.send("admin token must needed!")
        return
    }
    const isAdminTest=await adminverify(req.query.token)
    console.log(isAdminTest)
    if(!isAdminTest){
        res.send("failed!")
        return;
    }

    const idVrify=await Design.findOne({design_id:req.params.id}).catch((err) => {
        console.log(err);
        res.json("failed");
        return;
      });
      if(!idVrify){
        res.send("invaid design_id!")
        return;
      }

    const relevantDesigns = await Design.deleteOne({design_id:req.params.id}).catch((err) => {
      console.log(err);
      res.json("failed");
      return;
    });
  
    console.log(relevantDesigns)
    res.send("succefully deleted!")
  })

module.exports = designRoutes

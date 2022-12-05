const express = require('express')
const customizeRoutes = express.Router()
const Customize = require('../models/customizeModel')
const Customer = require('../models/customerModel')
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
            const idVrify=await Customer.findOne({customer_id:decoded.id.customer_id,isAdmin:true}).catch((err) => {
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

customizeRoutes.post('/add', async (req, res) => {
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
    const idVrify=await Customize.findOne({customize_id:req.body.customize_id}).catch((err) => {
      console.log(err);
      res.json("failed");
      return;
    });
    if(idVrify){
      const idVrifyWithTitele=await Customize.findOne({customize_id:req.body.customize_id,title:req.body.title}).catch((err) => {
        console.log(err);
        res.json("failed");
        return;
      });
      if(!idVrifyWithTitele){
      res.send("this id already exist.")
      return;
    }
    }
    const titleVrify=await Customize.findOne({title:req.body.title,variation:{$elemMatch:{name:req.body.variation.name}}}).catch((err) => {
        console.log(err);
        res.json("failed");
        return;
      });
      if(titleVrify){
        res.send("this option already exist.")
        return;
      }
      const checkParetAvailabity=await Customize.findOne({title:req.body.title,}).catch((err) => {
        console.log(err);
        res.json("failed");
        return;
      });
      if(checkParetAvailabity){
        const newVariation={...req.body.variation,variation_id:req.body.customize_id+"-"+req.body.variation.name}
        const update=await Customize.findOneAndUpdate({customize_id:checkParetAvailabity.customize_id},{$push:{variation:newVariation}}).catch((err) => {
            console.log(err);
            res.json("failed");
            return;
          });
          res.send('successfully added')
      return
      }
  var data1 = req.body
  data1["variation"]={...data1.variation,variation_id:req.body.customize_id+"-"+req.body.variation.name}
  const data=new Customize(data1)
  await data
    .save()
    .then(() => {
      res.send('successfully added')
      return
    })
    .catch((err) => res.send('failed'))
})



//get relavent design
/* customizeRoutes.post('/getCustomize', async (req, res) => {
    const customizeOptions=req.body.options
    if(customizeOptions.length>0){
      var customizeData=[]
      for(let i=0;)
    }
  }) */

  //update relevant design
  customizeRoutes.put('/update/:id', async (req, res) => {
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

    const idVrify=await Customize.findOne({design_id:req.body.design_id}).catch((err) => {
        console.log(err);
        res.json("failed");
        return;
      });
      if(idVrify){
        res.send("design_id already exist.")
        return;
      }
    const relevantCustomizes = await Customize.findOneAndUpdate({design_id:req.params.id},{$set:req.body}).catch((err) => {
      console.log(err);
      res.json("failed");
      return;
    });
  
    res.send("succefully updated!")
  })

  customizeRoutes.delete('/delete/:id', async (req, res) => {

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

    const idVrify=await Customize.findOne({design_id:req.params.id}).catch((err) => {
        console.log(err);
        res.json("failed");
        return;
      });
      if(!idVrify){
        res.send("invaid design_id!")
        return;
      }

    const relevantCustomizes = await Customize.deleteOne({design_id:req.params.id}).catch((err) => {
      console.log(err);
      res.json("failed");
      return;
    });
  
    console.log(relevantCustomizes)
    res.send("succefully deleted!")
  })

module.exports = customizeRoutes

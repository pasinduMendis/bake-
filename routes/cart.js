const express = require("express")
const cartRoutes = express.Router();
const Customer = require("../models/customerModel");
require('dotenv').config();
const jwt=require("jsonwebtoken")

const customerverify=async (token)=>{
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
            const existCustomer=await Customer.findOne({customer_id:decoded.id}).catch((err) => {
                console.log(err);
                return "failed";
              });
              if(existCustomer){
                return existCustomer;
              }
              return "failed";
        }
      } catch (error) {
        return "failed";
      }
}


//add to cart
cartRoutes.post("/addCart", async (req, res) => {
    if(!req.query.userToken){
        res.send("userToken must needed!")
        return
      }
  const relevantCustomer=await customerverify(req.query.userToken)
  console.log(relevantCustomer)
  if(relevantCustomer=="failed"){
    res.send("invalid token")
    return
  }
  const body=req.body
  const updatedCart=[body,...relevantCustomer.cart]
 
  await Customer.findOneAndUpdate({customer_id:relevantCustomer.customer_id},{$set:{cart:updatedCart}})
        .catch((err) => {
          console.log(err);
          res.json(failHtml("failed"));
          return;
        });

        res.send("successfully added.")
        return
  
  })

  //get all cart items
  cartRoutes.get("/getCartItems", async (req, res) => {
    if(!req.query.userToken){
        res.send("userToken must needed!")
        return
      }
  const relevantCustomer=await customerverify(req.query.userToken)
  //console.log(relevantCustomer)
  if(relevantCustomer=="failed"){
    res.send("invalid token")
    return
  }

        res.json(relevantCustomer.cart)
        return
  
  })

  //delete item in cart
cartRoutes.delete("/deleteCart/:id", async (req, res) => {
    if(!req.query.userToken){
        res.send("userToken must needed!")
        return
      }
  const relevantCustomer=await customerverify(req.query.userToken)

  if(relevantCustomer=="failed"){
    res.send("invalid token")
    return
  }

  const cartUser=await Customer.findOne({customer_id:relevantCustomer.customer_id,cart:{$elemMatch:{_id:req.params.id}}})
        .catch((err) => {
          console.log(err);
          res.json(failHtml("failed"));
          return;
        });

        if(!cartUser){
            res.send("invalid cart item")
        }
        var updatedCart=cartUser.cart
        const index=updatedCart.findIndex(item=>item._id==req.params.id)
        //console.log(index)
        updatedCart.splice(index,1)

        await Customer.findOneAndUpdate({customer_id:relevantCustomer.customer_id},{$set:{cart:updatedCart}})
        .catch((err) => {
          console.log(err);
          res.json(failHtml("failed"));
          return;
        });

        res.send("successfully deleted")
        return
  
  })

    //update item qty in cart
  cartRoutes.put("/updateQty/:id", async (req, res) => {
    if(!req.query.userToken){
        res.send("userToken must needed!")
        return
      }
      if(!req.body.qty){
        res.send("updated qty must needed.")
      }
  const relevantCustomer=await customerverify(req.query.userToken)

  if(relevantCustomer=="failed"){
    res.send("invalid token")
    return
  }

  const cartUser=await Customer.findOne({customer_id:relevantCustomer.customer_id,cart:{$elemMatch:{_id:req.params.id}}})
        .catch((err) => {
          console.log(err);
          res.json(failHtml("failed"));
          return;
        });

        if(!cartUser){
            res.send("invalid cart item")
        }
        var updatedCart=cartUser.cart
        const index=updatedCart.findIndex(item=>item._id==req.params.id)
        //console.log(index)
        var relevantCartItem=updatedCart[index]
        updatedCart.splice(index,1)
        relevantCartItem["qty"]=req.body.qty
        updatedCart.push(relevantCartItem)
        await Customer.findOneAndUpdate({customer_id:relevantCustomer.customer_id},{$set:{cart:updatedCart}})
        .catch((err) => {
          console.log(err);
          res.json(failHtml("failed"));
          return;
        });

        res.send("successfully updated")
        return
  
  })
  
module.exports = cartRoutes;

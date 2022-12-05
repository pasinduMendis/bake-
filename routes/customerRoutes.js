const express = require("express");
const customerRoutes = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const Customer = require("../models/customerModel");
const { v4: uuidv4 } = require("uuid");
const nodemailer=require("nodemailer");
require('dotenv').config();

//email verification
customerRoutes.get("/emailVerify", async (req, res) => {
  //res.send(failHtml("aaa"))
  var body={};
var decoded
try {
  decoded = jwt.verify(
    req.query.userToken,
    process.env.JWT_SECRET
  )
  //console.log(decoded)
  body=decoded.id
  if (!decoded) {
    res.send(failHtml("No token provided"))
    return;
  }
} catch (error) {
  res.send(failHtml("failed!"))
  return;
}
const customer=new Customer(body)
customer
      .save()
      .then((result) => {
        console.log(result);
        res.send(createAccountSuccessHTML);
        return;
      })
      .catch((err) => {
        console.log(err);
        res.json(failHtml("failed"));
        return;
      });

})

//customer register
customerRoutes.post("/sign-up", async (req, res) => {
  const customer = req.body;
  customer["customer_id"] = uuidv4();

  const nicCheck = await Customer.findOne({ email: customer.nic }).catch(
    (err) => {
      console.log(err);
      res.json("failed");
      return;
    }
  );
  if (nicCheck) {
    res.send("entered NIC number is already used.");
    return;
  }

  const emailCheck = await Customer.findOne({ email: customer.email }).catch(
    (err) => {
      console.log(err);
      res.json("failed");
      return;
    }
  );

  if (emailCheck == null) {
    const salt = await bcrypt.genSalt(10);
    customer.password = await bcrypt.hash(customer.password, salt);
    
  try {
    const token = jwt.sign({ id: customer }, process.env.JWT_SECRET, {});
    
  let transporter=nodemailer.createTransport({
    service:"Gmail",
    auth:{
      user:process.env.NODEMAILER_USER,
      pass:process.env.NODEMAILER_PASS
    }
  })

  let mailOptions={
    from:"bakeddelightssl@gmail.com",
    to:customer.email,
    subject:"Baked Delights Email Verification",
    html:createAccountHTML(token)
  }

  try{
    await transporter.sendMail(mailOptions)
    res.send("email sent")
}catch (error) {
  //console.log("******")
  res.send(error.message)
  return;
  }

  } catch (error) {
    res.send(error.message)
    return;
  }
  } else {
    res.json("already registered");
    return;
  }
});

//customer sign-in
customerRoutes.get("/sign-in", async (req, res) => {
  const { email, password } = req.query;
  if (!email || !password) {
    res.send("email and password must needed.");
    return;
  }
  var findId = await Customer.findOne({
    email: email,
  }).catch((err) => {
    console.log(err);
    res.json("failed");
    return;
  });
  if (!findId) {
    res.send("user not found!");
    return;
  }
  const validPassword = await bcrypt.compare(password, findId.password);
  if (validPassword) {
    const token = jwt.sign({ id: findId.customer_id }, process.env.JWT_SECRET, {});
    const resUser={userToken:token,...findId._doc}
    res.send(resUser);
    return;
  } else {
    res.send("incorrect password");
    return;
  }
});

//admin sign-in
customerRoutes.get("/admin/sign-in", async (req, res) => {
  const { email, password } = req.query;
  if (!email || !password) {
    res.send("email and password must needed.");
    return;
  }
  const findId = await Customer.findOne({
    email: email,
    isAdmin:true,
  }).catch((err) => {
    console.log(err);
    res.json("failed");
    return;
  });
  if (!findId) {
    res.send("admin not found!");
    return;
  }
  const validPassword = await bcrypt.compare(password, findId.password);
  if (validPassword) {
    const token = jwt.sign({ id: findId }, process.env.JWT_SECRET, {});
    res.json({token:token});
    return;
  } else {
    res.send("incorrect password");
    return;
  }
});

//create account email template
const createAccountHTML=(token)=>`<head>
<style>
.button {
  background-color: #1E90FF;
  border: none;
  color: white;
  padding-left:25px;
  padding-right:25px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
</style>
</head><body>
<div style="height:100vh;" class="d-flex align-items-center justify-content-center">
<div class="row">
<div>
<h1 style="text-align: center;"> EMAIL VERIFICATION </h1>
</div>
<div>
<h3 style="color:#008B8B;text-align: center;"> click verfy button... </h3>
</div>
<div style="text-align: center;">
<button class="button">
 <a href="http://localhost:4000/customer/emailverify?userToken=${token}&type=createAccount" style="text-decoration: none;" ><h3 style="color:white;text-decoration: none;">verify</h3></a>
 </button> 
 </div>
 </div>
 </div>
 </body>`

 //success email template
 const createAccountSuccessHTML=`<head><link
href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
rel="stylesheet"
integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
crossorigin="anonymous"
/></head><body>
<div style="height:100vh;width:100%;overflow:hidden;" class="d-flex align-items-center justify-content-center">
<div class="row">
<div class="col-12 mb-2">
<h1 class="text-center"> EMAIL VERIFICATION </h1>
</div>
<div class="col-12 mb-2">
<h3 class="text-center text-warning"> congradulations! you have successfully created your account. </h3>
</div>
<div class="col-12 text-center mt-2">
 <button style="width:30%" type="button" class="btn btn-lg btn-primary">LOGIN</button>
 </div> 
 </div>
 </div>
 <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-U1DAWAznBHeqEIlVSCgzq+c9gqGAJn5c/t99JyeKa9xxaYpSvHU5awsuZVVFIhvj"
      crossorigin="anonymous"
    ></script>
 </body>`

 //failed email template
 const failHtml=(msg)=> {return`<head><link
 href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
 rel="stylesheet"
 integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
 crossorigin="anonymous"
 /></head><body>
 <div style="height:100vh;width:100%;" class="d-flex align-items-center justify-content-center">
 <div class="row">
 <div class="col-12 mb-2">
 <h1 class="text-center"> EMAIL VERIFICATION </h1>
 </div>
 <div class="col-12 mb-2">
 <h1 class="text-center text-danger"> Oops!! </h1>
 </div>
 <div class="col-12 text-center mt-2">
  <h3>${msg}</h3>
  </div> 
  </div>
  </div>
  <script
       src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"
       integrity="sha384-U1DAWAznBHeqEIlVSCgzq+c9gqGAJn5c/t99JyeKa9xxaYpSvHU5awsuZVVFIhvj"
       crossorigin="anonymous"
     ></script>
  </body>`
}

module.exports = customerRoutes;

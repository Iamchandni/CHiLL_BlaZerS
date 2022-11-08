const router=require("express").Router();
const User= require("../models/User")
const bcrypt = require("bcrypt");
const { json } = require("express");

//registering users with email , password and username
router.post("/register", async (req,res) =>{
 
    try{
        const salt = await bcrypt.genSalt(11);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
       
        const newuser = await new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        });
       
        const user =     await newuser.save();
        res.status(200).json(user);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
});

// code for login
router.post("/login",async (req,res)=>
{
  try{
    const user =  await User.findOne({email:req.body.email});
   if(!user)
   res.status(404).json("User not found");

   const validpassword = await bcrypt.compare(req.body.password, user.password)
   if(!validpassword)
   res.status(404).json("wrong password");

   res.status(200).json(user);
  }
  catch(err){
      res.status(500).json(err);
  }
});
module.exports= router; 
const router=require("express").Router();
const User= require("../models/User")
const bcrypt = require("bcrypt");
const { json } = require("express");
const Notify = require("../models/Notify");
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
       
        const user = await newuser.save();
        const notify=await new Notify({
            user_id:req.body.username,
            notifications:[{notifications_received:'your account is created'}]
         });
         notify.save(function(done,err){
            if(done){
                res.status(200).json(user);
                res.render('details')
            }
         })
    }
    catch(err)
    {
        res.status(500).json(err);
        res.render('register',{error:'please try again'})
    }
});
router.get('/register',function(req,res){
    res.render('register');
})

// code for login
router.post("/login",async (req,res)=>
{
  try{
    const user =  await User.findOne({email:req.body.email});
   if(!user){
   res.status(404).json("User not found");
   res.render('login',{error:'user not found'})}
   const validpassword = await bcrypt.compare(req.body.password, user.password)
   if(!validpassword){
   res.status(404).json("wrong password");
   res.render('login',{error:'wrong password'})}
   else{
   res.render('dashboard')   
   res.status(200).json(user);
  }}
  catch(err){
      res.status(500).json(err);
  }
});
router.get('/login',function(req,res){
    res.render('login');
})
module.exports= router; 
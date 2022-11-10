const passport=require('passport')
const User = require('../models/User')
const router=require('express').Router()
router.use(session({
    secret:'scretsofourlife',
    resave:false,
    saveUninitialized:false
}))
userSchema.plugin(findOrCreate)
const GoogleStrategy=require('passport-google-oauth20').Strategy
const findOrCreate=require('mongoose-findorcreate')
passport.use(User.createStrategy())
passport.serializeUser(function(user,done){
    done(null,user.id)
})
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user)
    })
})
passport.use(new GoogleStrategy({
    clientID:GOOGLE_CLIENT_ID,
    clientSecret:GOOGLE_CLIENT_SECRET,
    callbackURL:'https://localhost:3000/auth/google/dashboard'
},function(accessToken,refreshToken,profile,cb){
    User.findOrCreate({googleId:profile.id},function(err,user){
        return cb(err,user)
    })
}
))
router.get('/app/google',
    passport.authenticate("google", {scope:['profile']}))
router.get('/auth/google/dashboard', 
passport.authenticate('google',{failureRedirect:'/login'}),
function(req,res){
    res.redirect('/dashboard')
})
router.get('/dashboard',function(req,res){
    if(req,isAuthenticated()){
        res.render('dashboard')
    }else{
        res.redirect('/login')
    }
})
module.exports=router
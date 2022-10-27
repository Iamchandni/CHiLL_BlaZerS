//jshint esversion:6
require('dotenv').config()
const express=require('express')
const bodyParser=require('body-parser')
const ejs=require('ejs')
const mongoose=require('mongoose')
const app=express()
// const encrypt=require('mongoose-encryption')
const bcrypt=require('bcrypt')
// const session=require('express-session')
// const passport=require('passport')
// const passportLocalMongoose=require('passport-local-mongoose')
const saltRounds=16
// const GoogleStrategy=require('passport-google-oauth20').Strategy
// const findOrCreate=require('mongoose-findorcreate')
// const skillset=[]
app.use(express.static('public'))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
// app.use(session({
//     secret:'Our little secret',
//     resave:false,
//     saveUninitialized:false
// }))
// app.use(passport.initialize())
// app.use(passport.session())
mongoose.connect('mongodb://localhost:27017/schema',{useNewURLParser:true})
const userSchema=new mongoose.Schema({
    email:String,
    password:String
})
const workSchema=new mongoose.Schema({
    name:String,
    age:Number,
    date:String,
    img:
    {
        data: Buffer,
        contentType: String
    },
    aboutYou:String,}
)
const skillSchema=new mongoose.Schema({
    skill:String
})
// passport.use(new GoogleStrategy({
//     clientID:process.env.GOOGLE_CLIENT_ID,
//     clientsecret:process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL:'https://www.example.com/auth/google/user',
//     userProfileURL:'https://www.googleapis.com/oauth2/3/userinfo'
// },function(accessToken,refreshToken,profile,cb){
//     User.findOrCreate({googleID:profile.id},function(err,user){
//         return cb(err,user)
//     })
// }
// ))
// userSchema.plugin(findOrCreate)
// const secret=process.env.SECRET
// userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']})
const User=new mongoose.model('User',userSchema)
const work=new mongoose.model('Work',workSchema)
const Skill=new mongoose.model('Skill',skillSchema)
app.get('/',function(req,res){
    res.sendFile('user')
})
// app.get('/auth/google',function(req,res){
//     passport.authenticate('google',{scope:['profile']})
// })
// app.get('auth/google/secrets',
// passport.authenticate('google',{failureRedirect:'/login'}),
// function(req,res){
//     res.redirect('/dashboard')
// })
app.get('/register',function(req,res){
    res.render('register')
})
app.post('/register',function(req,res){
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
        bcrypt.compare(req.body.confirmPassword,req.body.password,function(err,res){
            if(err){
              res.redirect('/register')
              res.render('user',{error:'write correct password'})
            }else{
                if(req.body.email==="" || req.body.password===''||req.body.confirmPassword===''||!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))){
                    res.render('user',{error:'please fill all details'})
                    res.redirect('/register')
                }
                const newUser= new User({
                    email:req.body.email,
                    password:req.body.password})
                    
                    newUser.save(function(err){ 
                        if(!err){
                           console.log(err)
                        }else{[
                            res.render('details')
                        ]}
                    })
            }
        })
           
    })})
//     })
// })
app.get('/login',function(req,res){
    res.render('login')
})
app.post('/login',function(req,res){
    const username=req.body.username
    const password=req.body.pwd
    User.findOne({email:username},function(err,foundUser){
        if(err){
            res.redirect('/login')
            res.send('user',{error_login:'this account dont exists!!'})
        }else{
            if(foundUser){
            bcrpyt.compare(password,foundUser.password,function(err,res){
                if(result==true){
                    res.render('dashboard')
                }
                else{
                    res.redirect('/login')
                    res.send('user',{error_login:'this password is wrong!'})
                }
            })
            }
        }
    })
})
// app.get('/secrets',function(req,res)
// {
//     if(req.isAuthenticated()){
//         res.render('secrets')
//     }else{
//         res.redirect('/login')
//     }
// })
app.get('/details',function(req,res){
    res.render('details',{work:work})
})
app.post('/details',function(req,res){
    const name=req.body.name
    const age=req.body.age
    const date=req.body.date
    const img=req.body.img
    const aboutYou=req.body.aboutYou
        const newwork=new work({
        name:name,
        age:age,
        date:date,
        img:img,
        aboutYou:aboutYou,
    })
    newwork.save(function(err,res){
        if(err){
            res.redirect('/details')
            // res.send("please fill all details")
        }
        else{
            res.render('skills')
        }
    })
})
app.get('/skill',function(req,res){
    Skill.find({},function(){
    res.render('skill',{skilllist:Skill})})
})
app.post('/skill',function(req,res){
    const skill1=req.body.skill
    const newskill=new Skill({
        skill:skill1
    })
    newskill.save(function(err,res){
        if(err){
            res.send("error")
        }else{
            res.redirect('/skill')
        }
    })
})
app.delete('/skill',function(req,res){
    const checkbox=req.body.checkbox
    Skill.findByIdAndRemove(checkbox,function(err){
        if(!err){
            console.log('deleted')
            res.redirect('/skill')}})})
// app.post('/detailsskill',function(req,res){
//     const skill=req.body.skills
//     const newskill=new Skill({
//            skill:skill
//     })
//     newskill.save(function(err,res){
//         if(err){
//             console.log(err)
//         }else{
//             res.redirect('/detailsskill')
//         }
//     })

// })
app.get('/dashboard',function(req,res){
    res.render('dashboard',{skilllist:Skill,worklist:work,userlist:User})
})
app.listen(3000 ,function(){
    console.log('server is running on port 3000')
})

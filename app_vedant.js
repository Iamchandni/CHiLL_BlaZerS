require('dotenv').config()
const express=require('express')
const bodyParser=require('body-parser')
const ejs=require('ejs')
const mongoose=require('mongoose')
const app=express()
const multer=require('multer')
const path=require('path')
const encrypt=require('mongoose-encryption')
const bcrypt=require('bcrypt')
const session=require('express-session')
const passport=require('passport')
const passportLocalMongoose=require('passport-local-mongoose')
const saltRounds=16
const GoogleStrategy=require('passport-google-oauth20').Strategy
const findOrCreate=require('mongoose-findorcreate')
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
    id:String,
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
const followSchema=new mongoose.Schema({
    id:String,
    follow:{
        id_followers:String
    },
    following:{
        id_following:String
    }
})
const skillSchema=new mongoose.Schema({
    id:User.id,
    skill:String
})
const postScehma=new mongoose.Schema({
        id:String,
        imgpost:
        {
            data: Buffer,
            contentType: String
        },
        comment:String,
        comments:{
                type:Array,
                default:[{
                    id_of_comments:String,
                    comments_by_id:String
                }]
        },
        likes:{
            type:Array,
            default:[{liked_id:String}]
        },
        createdAt:Date
    }
)
const notifyScehma=new mongoose.Schema({
    id:String,
    requests:{
    type:Array,
     default:[] 
    },
     likes:{
        type:Array,
        default:[{id_liked_post:String}] 
     }
})
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientsecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'https://www.example.com/auth/google/user',
    userProfileURL:'https://www.googleapis.com/oauth2/3/userinfo'
},function(accessToken,refreshToken,profile,cb){
    User.findOrCreate({googleID:profile.id},function(err,user){
        return cb(err,user)
    })
}
))
userSchema.plugin(findOrCreate)
const secret=process.env.SECRET
userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']})
const User=new mongoose.model('User',userSchema)
const work=new mongoose.model('Work',workSchema)
const Skill=new mongoose.model('Skill',skillSchema)
const Post=new mongoose.model('Post',postScehma)
const friends=new mongoose.model('Follow',followSchema)
const notifications=new mongoose.model('Notification',notifyScehma)
app.get('/',function(req,res){
    res.sendFile('user')
})
app.get('/auth/google',function(req,res){
    passport.authenticate('google',{scope:['profile']})
})
app.get('auth/google/secrets',
passport.authenticate('google',{failureRedirect:'/login'}),
function(req,res){
    res.redirect('/dashboard')
})
app.get('/register',function(req,res){
    res.render('register')
})
let id='';
app.post('/register',function(req,res){
    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
        bcrypt.compare(req.body.confirmPassword,req.body.password,function(err,res){
            if(err){
              res.redirect('/register')
              res.render('register',{error:'write correct password'})
            }else{
                if(req.body.email==="" || req.body.password===''||req.body.confirmPassword===''||!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))){
                    res.render('register',{error:'please fill all details'})
                    res.redirect('/register')
                }
                const newUser= new User({
                    email:req.body.email,
                    password:req.body.password})
                    
                    newUser.save(function(err){ 
                        if(!err){
                           console.log(err)
                        }else{[
                            res.render(':user._id/details')
                        ]}
                    })
            }
        })
           
    })
})
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
            res.send('login',{error_login:'this account dont exists!!'})
        }else{
            if(foundUser){
            bcrpyt.compare(password,foundUser.password,function(err,res){
                if(result==true){
                    res.render('dashboard')
                }
                else{
                    res.redirect('/login')
                    res.send('login',{error_login:'either password is woring or email dont exists!!'})
                }
            })
            }
        }
    })
})
app.get('/secrets',function(req,res)
{
    if(req.isAuthenticated()){
        res.render('secrets')
    }else{
        res.redirect('/login')
    }
})
var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });
app.get('/:user._id/details',function(req,res){
    res.render('details',{work:work})
})
app.post('/:user_id/dashboard/posted',upload.single('image'),function(req,res){
    const d=new Date()
    const post =new Post({
        id:req.params.user_id,

            imgpost:
            {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            },
            comment:req.body.comment,
            comments:{
                id_of_comments:[],
                comments_by_id:[]
            },
            likes:{
                id_liked:[]
            },
            createdAt:toString(d.getDate)+'/'+toString(d.getMonth)+'/'+toString(d.getFullYear)+' '+toString(d.getHours)+':'+toString(d.getMinutes)+':'+toString(d.getSeconds)

    })
    post.save(function(err,res){
        if(err){
            console.log(err)
        }else{
            res.redirect('/:user_id/dashboard')
        }
    })
 })
app.patch('/:user_id/dashboard/:user_liked/liked',function(req,res){
    Post.findOne({id:req.params.user_liked},function(err,found){
        if(err){
    Post.findOneAndUpdate({id:req.params.user_liked},{$push:{likes:req.params.user_id}},function(err,done){
      if(!err){
        res.redirect('/:user_id/dashboard')
        notifications.findOneAndUpdate({id:req.params.user_liked},{$push:{likes:{user_liked_post:req.params.user_liked}}},function(err,done){
            if(!err){
              res.redirect('/:user_id/dashboard')
              
            } 
      })
      }
    })}
    else{
        Post.findOneAndUpdate({id:req.params.user_liked},{$pull:{likes:req.params.user_id}},function(err,done){
            if(!err){
              res.redirect('/:user_id/dashboard')
            }
          })
    }
})})
app.patch('/:user_id/dashboard/:user_commented/comments_on_post',function(req,res){
    Post.findOneAndUpdate({id:req.params.user_commented},{$push:{comments:{id_of_comments:req.params.user_id,comments_by_id:req.body.comment}}},function(err,done){
          if(!err){
            notifications.findOneAndUpdate({id:req.params.user_commented},{$push:{comment:{id_commented_post:req.params.user_id}}},function(err,done){
                if(!err){
                  res.redirect('/:user_id/dashboard')
                  
                } 
          })
          } 
    })
})
app.delete('/:user_id/dashboard/delete',function(req,res){
    const checkedItemId=req.body.checkbox
    Post.findByIdAndRemove(checkedItemId,function(err){
        if(!err){
            console.log('deleted')
            res.redirect('/')
        }
    })
})
app.post('/:user._id/details',function(req,res){
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
            res.redirect('/:user._id/details')
            // res.send("please fill all details")
        }
        else{
            res.render('skills')
        }
    })
})
app.get('/:user._id/skill',function(req,res){
    Skill.find({},function(){
    res.render('skill',{skilllist:Skill})})
})
app.post('/:user_id/skill',function(req,res){
    const skill1=req.body.skill
    const newskill=new Skill({
        skill:skill1
    })
    newskill.save(function(err,res){
        if(err){
            res.send("error")
        }else{
            res.redirect('/:user._id/skill')
        }
    })
})
app.delete('/:user_id/skill',function(req,res){
    const checkbox=req.body.checkbox
    Skill.findByIdAndRemove(checkbox,function(err){
        if(!err){
            console.log('deleted')
            res.redirect('/:user_id/skill')}})})
app.get('/:user._id/dashboard',function(req,res){
    res.render('dashboard',{skilllist:Skill,worklist:work,userlist:User,postlist:Post})
})
// const button = document.getElementById('post-btn');

// button.addEventListener('click', async _ => {
//   try {     
//     const response = await fetch('/:user._id/dashboard', {
//       method: 'post',
//       body:{

//       }
      
//     });
//     Post.updateOne()
//     console.log('Completed!${err}', response);
//   } catch(err) {
//     console.error(`Error: ${err}  `);
//   }
// });
app.post('/:user._id/:usershowing/follow',function(req,res){
    friends.findOne({id:user._id},function(err,docs){
   if(err){
    const friend=new friends({
        id:user._id,
        follow:{
            id_followers:{}
        },
        following:{
            id_following:{id:req.params.usershowing}
        }
    })}else{
        friends.findOneAndUpdate({following},{$pull:{following:{id:req.params.usershowing}}},function(err,founded){
        if(!err){
            res.redirect('/:user._id/:usershowing/')
        }
        })
}})
    friends.findOne({id:req.params.usershowing},function(err,docs){
        if(err){
            const friend=new friends({
                id:req.params.usershowing,
                follow:{
                    id_followers:{id:user._id}
                },
                following:{
                    id_following:{}
                }
            })
        
}else{
    friends.findOneAndUpdate({followers},{$pull:{followers:{id:req.params.usershowing}}},function(err,founded){
        if(!err){
            res.redirect('/:user._id/:usershowing/')
        }
        })
}
})})
app.patch('/:user._id/dashboard/likes',function(req,res){
    Post.findOne({posted},function(err,docs){
        if(docs){
            liked=docs.likes
        }else{
            res.send('No articles matching that title was found')
        }
    })
  Post.updateOne({},{likes:liked+1},function(err,liked){
 if(err){
    res.render('/:user._id/dashboard',{error_like:'error occured'})
 }else{
    res.render('/:user._id/dashboard')
 }
  })
})

// app.post('/user._id/')
app.post('/:user._id/dashboard',function(req,res){
     const img=img
     const comment=comment
     const post=new Post({
        id:User.id,
        posted:{
            img:img,
            comment:comment,
            comments:{
                id_of_comment:'',
                comment_by_id:''
            },
            likes:0
        }
     })
     post.save(function(err,done){
        if(err){
            res.render('dashboard',{error:'an error occured'})
            res.redirect('/dashboard')
        }else{
            res.render('dashboard',{post:Post})
            res.redirect('/dashboard')
        }
     })
})
app.patch('/dashboard',function(req,res){

})
app.listen(3000 ,function(){
    console.log('server is running on port 3000')
})

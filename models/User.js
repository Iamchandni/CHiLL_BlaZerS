const mongoose=require("mongoose");
 const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    googeId:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:false,
        min:6
    },
    following:{
        type:Array,
        default:[]
    },
    followers:{
        type:Array,
        default:[]
    },
    aboutMe :{
        type:String,
        max:251,
        default:""
    }
 });

 module.exports= mongoose.model("User", UserSchema);
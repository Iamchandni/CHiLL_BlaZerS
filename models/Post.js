const mongoose=require("mongoose");
 const PostSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        
    },
    likes:{
        type:Array,
        default:[]
    },
    description :{
        type:String,
        max:551,
        default:""
    },
    img:{
        type: String,
    }
 });

 module.exports= mongoose.model("Post", PostSchema);
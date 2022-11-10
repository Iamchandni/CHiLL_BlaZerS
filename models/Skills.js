const mongoose=require("mongoose");
const skillSchema=new mongoose.Schema({
    id:User.id,
    skill:String
})
module.exports= mongoose.model("Skill", skillSchema);
const mongoose=require('mongoose')
const notifySchema=new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    notifications:{
        type:Array,
        required:true,
         default:[{notifications_received:String}] 
        }
})
module.exports=mongoose.model('Notify',notifySchema)
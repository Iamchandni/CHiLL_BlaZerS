const router=require("express").Router();
const Notify = require("../models/Notify");
const User = require("../models/User");

//updating the details of the user
router.put("/:id", async (req,res) =>{
    if(req.body.userId === req.params.id)
    {
        if(req.body.password)
        {
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
               
            }
            catch(err)
            {
                return res.status(500).json(err);
            }
        }
       
         const user = await User.findByIdAndUpdate(req.params.id , {$set : req.body }, {upsert:true});
          return res.status(200).json("Account has been updated successfully!!");
        console.log("Account has been updated successfully!!")
    }
         else{
            return res.status(403).json("You can update only your account");
            console.log("You can update only your account")
        }
    
});

//delete any user data
router.delete("/:id", async (req,res) =>{
    if(req.body.userId === req.params.id)
    {
         const user = await User.findByIdAndDelete(req.params.id );
          return res.status(200).json("Account has been deleted successfully!!");
        console.log("Account has been deleted successfully!!")
    }
         else{
            return res.status(403).json("You can delete only your account");
            console.log("You can delete only your account")
        }
    
});

//search any user
router.get("/:id" , async(req,res)=>{

    try {
        const user = await User.findById(req.params.id);
        const {password, ...other}= user._doc
        res.status(200).json(other);
        if(req.params.id==req.body.userId){
            res.render('userfollow',{other:other})
        }else{
            res.render('dashboard',{other:other})
            }
    } catch (err) {
        res.status(500).json(err);
    }
})

//follow a user
router.put("/:id/follow", async(req,res) =>{
    if(req.body.userId !== req.params.id)
    {
        try{
            const user = await User.findById(req.params.id);
            const currentuser = await User.findById(req.body.userId);
            if(!(user.followers.includes(req.body.userId)))
            {
                await  user.updateOne({$push : {followers :req.body.userId}});
               await  currentuser.updateOne({$push : {following :req.params.id}});
               let name=await User.findById({id:req.params.userId})
             await Notify.findOneAndUpdate({id:req.params.id},{$push:{notifications:{notifications_received:name.username+'Started follwoing you'}}})
               res.status(200).json("User has been followed");
            }
            else{
                res.status(403).json("You already follow this User");
            }
        }
        catch(err)
        {
            res.status(500).json(err);
        }
    }
    else{
        res.status(403).json("You cannot follow yourself");
    }
});
// unfollow any user
router.put("/:id/unfollow", async(req,res) =>{
    if(req.body.userId !== req.params.id)
    {
        try{
            const user = await User.findById(req.params.id);
            const currentuser = await User.findById(req.body.userId);
            if((user.followers.includes(req.body.userId)))
            {
                await  user.updateOne({$pull : {followers :req.body.userId}});
               await  currentuser.updateOne({$pull : {following :req.params.id}});
               res.status(200).json("User has been unfollowed");
            }
            else{
                res.status(403).json("You already unfollowed this User");
            }
        }
        catch(err)
        {
            res.status(500).json(err);
        }
    }
    else{
        res.status(403).json("You cannot unfollow yourself");
    }
});

module.exports= router;
const router = require("express").Router();
const Post = require("../models/Post");
const Notify = require("../models/Notify");
const User = require("../models/User");
//create a post
router.post("/", async(req,res)=>{
 
    const newPost = new Post(req.body)
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
})

//update a post
router.put("/:id", async (req,res) =>{

    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId )
        {
             await post.updateOne({ $set : req.body});
             res.status(200).json("Your post has been updated");
        }
        else{
            res.status(403).json("You can update only your post");
        }
    }catch(err)
    {
        res.status(500).json(err)
    }
});


// delete a post
router.delete("/:id", async (req,res) =>{

    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId )
        {
             await post.deleteOne();
             res.status(200).json("Your post has been deleted");
             res.render()
        }
        else{
            res.status(403).json("You can delete only your post");
        }
    }catch(err)
    {
        res.status(500).json(err);
    }
});
let likes_no=0;
// like or dislike  post
router.put(":/id/like", async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!(post.likes.includes(req.body.userId)))
        {
            await post.updateOne({$push : {likes : req.body.userId}});
            let name=await User.findById({id:req.body.userId})
            await Notify.findOneAndUpdate({id:req.params.id},{$push:{notifications:{notifications_received:name.username+' liked your post'}}},function(done,err){
                if(!err){
                    res.status(200).json("The post has been liked");

                }
            })
        }
        else{
            await post.updateOne({$pull :{likes : req.body.userId}})
            res.status(200).json("The post has been disliked");

        }
    } catch (error) {
        res.status(500).json(err);
    }
});

// get a post
router.get("/:id", async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        const notifications_of_id=await Notify.findById(req.params.id)
        res.status(200).json(post);
        if(req.params.id==req.body.userId){
        res.render('userfollow',{post_by_id:post})
    }else{
        res.render('dashboard',{post_by_id:post,notifications_of_id:notifications_of_id})
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;
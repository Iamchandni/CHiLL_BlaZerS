const router=require("express").Router();
const Skill=require('../models/Skills')
router.get('/:user._id/skill',function(req,res){
    Skill.find({},function(){
    res.render('skill',{skilllist:Skill})})
})
router.post('/:user_id/skill',function(req,res){
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
router.delete('/:user_id/skill',function(req,res){
    const checkbox=req.body.checkbox
    Skill.findByIdAndRemove(checkbox,function(err){
        if(!err){
            console.log('deleted')
            res.redirect('/:user_id/skill')}})})
module.exports=router
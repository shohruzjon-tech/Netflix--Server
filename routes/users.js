const router=require('express').Router();
const user=require('../models/User');
const CryptoJS=require('crypto-js');
const verify=require('./verifyToken')

// Update

router.put("/:id",verify, async(req, res)=>{
    if(req.user.id=req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password=CryptoJS.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
            ).toString()
        }

        try {
            const updateUser=await user.findByIdAndUpdate(req.params.id, {$set:req.body}, {new:true})
            res.status(200).json(updateUser)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You can update only your account")
    }
});


// DELETE

router.delete("/:id",verify, async(req, res)=>{
    if(req.user.id=req.params.id || req.user.isAdmin){
        try {
            await user.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been succesfully deleted")
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You can delete only your account")
    }
});

// GET

router.get("/find/:id", async(req, res)=>{

        try {
           const userData=  await user.findById(req.params.id)
           const {password, ...info}=userData._doc;
            res.status(200).json(info)
        } catch (error) {
            res.status(500).json(userData)
        }
});

// GET ALL


router.get("/", async(req, res)=>{
        const query=req.query.new;

         if(req.user.id=req.params.id || req.user.isAdmin){
        try {
            const users=query? await User.find().sort({_id:-1}).limit(10) : await User.find();
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You can delete only your account")
    }
});


// GET USER STATS


router.get('/stats',async(req, res)=>{
    const today=new Date();
    const lastYear=today.setFullYear(today.setFullYear-1);
    const monthsArray=[
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "july",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    try{
         const data=await user.aggregate([
             {
                 $project:{
                     month:{$month:"$createdAt"}
                 }
             },
             {
                 $group:{
                     _id:"$month",
                     total:{$sum:1}
                 }
             }
            ])
            res.status(200).json(data)
    }catch(error){
              res.status(500).json(error)
    }
} )

module.exports=router

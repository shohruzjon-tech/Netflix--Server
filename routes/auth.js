const router=require('express').Router();
const User=require('../models/User');
const CryptoJS=require("crypto-js");
const dotenv=require('dotenv')
const jwt=require('jsonwebtoken')

dotenv.config()

// register

router.post("/register", (req, res)=>{
     const newUser=new User({
         username:req.body.username,
         email:req.body.email,
         password:CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
     })
    newUser.save();
});

router.post("/login",async (req, res)=>{
    try{
       const user=await User.findOne({email:req.body.email});
       !user && res.status(401).send("Email is not exist") 
       
       const bytes=CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
       const originalPassword=bytes.toString(CryptoJS.enc.Utf8);

       originalPassword!==req.body.password && res.status(500).send("Wrong password")
       
       const accessToken=jwt.sign(
           {id:user._id, isAdmin:user.isadmin},
           process.env.SECRET_KEY,
           {expiresIn:"5d"}
        );

       const {password, ...info}=user._doc;

       res.status(200).json({...info, accessToken})
    }catch(err){
        res.status(500).json()
    }
})

module.exports=router
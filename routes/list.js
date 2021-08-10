const router=require('express').Router();
const List=require('../models/List');
const verify=require('./verifyToken')

// POST

router.post("/",verify, async(req, res)=>{
    if( req.user.isAdmin){
        const newList=new List(req.body);

        try {
            const svaedList=await newList.save();
            res.status(200).json(svaedList)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You are not allowed!")
    }
});
// DELETE

router.delete("/:id",verify, async(req, res)=>{
    if( req.user.isAdmin){

        try {
            await  List.findByIdAndDelete(req.params.id);
            res.status(200).json("The movie has been deleted successfully")
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You are not allowed!")
    }
});
// GET EACH

router.get("/",verify, async(req, res)=>{
         const typeQuery=req.query.type;
         const genreQuery=req.query.genre;
         const lists=[]
         try {
             if(type){
                 if(genreQuery){
                     lists=await List.aggregate([
                         {$sample:{size:10}},
                         {$match:{type:typeQuery, genre:genreQuery}}
                     ])
                 }
             }else{
                 lists=await List.aggregate([
                     {$sample:{size:10}}
                 ])
             }
         } catch (error) {
             res.status(500).json(error)
         }
});



module.exports=router
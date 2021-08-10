const router=require('express').Router();
const movie=require('../models/Movie');
const verify=require('./verifyToken')

// POST

router.post("/",verify, async(req, res)=>{
    if( req.user.isAdmin){
        const newMovie=new movie(req.body);

        try {
            const svaedMovie=await newMovie.save();
            res.status(200).json(svaedMovie)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You are not allowed!")
    }
});
// UPDATE

router.put("/:id",verify, async(req, res)=>{
    if( req.user.isAdmin){
        try {
            const updatedMovie=await movie.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            }, {new:true});
            res.status(200).json(updatedMovie)
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
             await movie.findByIdAndDelete(req.params.id);
            res.status(200).json("The movie has benn successfully deleted")
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You are not allowed!")
    }
});
// GET

router.get("/find/:id",verify, async(req, res)=>{
        try {
            const Movie= await movie.findById(req.params.id);
            res.status(200).json(Movie)
        } catch (error) {
            res.status(500).json(error)
        }
});
// GET Random

router.get("/random", async(req, res)=>{

       const type=req.query.type;
        let Movie;
        try {
            if(type==="series"){
                Movie=await movie.aggregate([
                    {$match:{isSeries:true}},
                    {$sample:{size:1}},
                ])
            }else{
                Movie=await movie.aggregate([
                    {$match:{isSeries:false}},
                    {$sample:{size:1}},
                ])
            }
            res.status(200).json(Movie)
        } catch (error) {
            res.status(500).json(error)
        }
});



// GET ALL

router.get("/:id",verify, async(req, res)=>{
    if( req.user.isAdmin){
        try {
            const moviesAll= await movie.find()
            res.status(200).json(moviesAll)
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("You are not allowed!")
    }
});


module.exports=router
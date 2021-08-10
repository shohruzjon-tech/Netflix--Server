const express=require("express");
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const authRoute=require("./routes/auth")
const userRoute=require('./routes/users')
const movieRoute=require('./routes/movies')
const listRoute=require('./routes/list');
const app=express();

dotenv.config()


mongoose.connect(
    process.env.ATLAS_URI, 
    {
      useNewUrlParser:true, 
      useCreateIndex:true, 
      useUnifiedTopology:true
    }
    )

const connection=mongoose.connection;

connection.once('open', ()=>{
        console.log("Mongo db connection established successsfully");
    })
app.use(express.json())
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/movies", movieRoute)
app.use("/api/lists", listRoute)
app.listen(3001,
()=>{console.log("Server is tarted  at http://localhost:3001")
})



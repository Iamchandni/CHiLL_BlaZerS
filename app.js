const express= require("express");
const mongoose= require("mongoose");

const helmet=require("helmet");
const morgan=require("morgan");
const userRoute = require("./routes/users")
const auth = require("./routes/auth");
const postRoute = require("./routes/posts");

mongoose.connect("mongodb://localhost/socialDB"),()=>{
   console.log("Connected to mongo db");
};

const app=express();


//all the middle ware code
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users",userRoute);
app.use("/api/auth",auth);
app.use("/api/posts" , postRoute);

app.get("/",(req,res)=>{
    res.send("<h1>Welcome to Home Page</h1>")
})

app.listen(4000,()=>{
console.log("Server is running successfully on port 4000!")
})
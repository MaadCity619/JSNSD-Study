const express = require("express")
require("dotenv").config()
const app = express()


// app.get("/",(req,res)=>{
//     res.status(200).send("route called successfully")
// })

//Blocking requests
//middlewear approach
// app.use((req,res,next)=>{
//     const path = req.path
//     if(path!=="/"){
//         next()
//     }
//     const method = req.method
//     if(method!=="GET"){
//         res.status(405).send("Operation Unauthorized")
//     }else{
//         next()
//     }
// })

//chaining approach

// app.route("/").get((req,res)=>{
//     res.status(200).send()
// }).post((req,res)=>{
//     res.status(405).send("Method not allowed")
// }).put((req,res)=>{
//     res.status(405).send("Method not allowed")
// }).delete((req,res)=>{
//     res.status(405).send("Method not allowed")
// })

// all chain

app.route("/").get((req,res)=>{
    res.status(200).send()
}).all((req,res)=>{
    res.status(405).send("Method not authorized")
})


//general fallback middlewear
app.use((req,res)=>{
    res.status(404).send("Request could not be found")
})


app.listen(process.env.PORT,()=>{
    console.log("Listening",process.env.PORT,process.env.TEST)
})
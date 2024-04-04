const express = require("express")
require("dotenv").config()

const app = express()


const blackList = ["::1"]

app.use((req,res,next)=>{
    const ip = req.ip
    console.log(ip)
    if(blackList.includes(ip)){
        return res.status(403).send("Forbidden")
    }else{
        next()
    }
})


app.route("/sam").get((req,res)=>{
    res.status(200).send("Successful")
}).all((req,res)=>{
    res.status(405).send("Unauthorized app")
})


app.use((req,res)=>{
    res.status(404).send("Not Found")
})


app.listen(process.env.PORT,()=>{
    console.log("Listening")
})
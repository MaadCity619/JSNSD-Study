const express = require("express")
require("dotenv").config()
const app = express()
const path = require("path")
const fs = require("fs")
const constants = require("constants");

const publicFolder = path.join(__dirname,"public")

app.use(express.static(publicFolder));



app.use("/public",(req,res)=>{


    const fileToServe = req.url.slice(1)

    if(fileToServe==="favicon.ico"){
        return res.status(204)
    }

    const pathToServe = path.join(publicFolder,fileToServe).replace(/\\/g,"/")

    console.log(pathToServe)


    fs.access(`${pathToServe}.html`,constants.F_OK,(err)=>{
        if(err){
            console.log("error")
            res.send("<h1>404 Page Not Found</h1>")
        }else{
            res.sendFile(`${pathToServe}.html`)
        }
    })
})



app.listen(process.env.PORT,()=>{
    console.log("Listening app.js")
})
const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const axios =require("axios")
const helmet = require("helmet")
const expressSanitizer = require("express-sanitizer")
const validator = require("validator")


app.use(helmet())
app.use(bodyParser.json())
app.use(expressSanitizer());

const userList= []

app.get("/hello",(req,res)=>{
    res.status(200).send("Hello World")
})

app.get("/users",(req,res)=>{
    res.status(200).send(userList)
})

app.get("/users/:id",(req,res)=>{
    const id = req.params.id
    if(!id.isNumber() || id.sign() !== 1){
        res.status(400).send({message:"Id must be a positive number"})
    }

    const user = userList.find((user)=>{
        return user.id === id
    })
    res.status(200).send(user)
})

app.post("/users",(req,res)=>{
    const id = req.body.id
    const name = req.sanitize( req.body.name)
    const age = req.sanitize(req.body.age)


    if(!id){
        res.status(400).send("You did not provide a valid Id")
    }


    if(typeof id !=="number"){
        res.status(400).send({message:"Id must be a number"})
        return
    }

    if(id<0){
        res.status(400).send({message:"Id must be a positive number"})
        return
    }

    userList.push({id,name,age})
    res.status(201).send("Resource was successfully created")
})

app.put("/users/:id",(req,res)=>{
    const id = req.params.id
    const name = expressSanitizer.sanitize( req.body.name)
    const age = expressSanitizer.sanitize(req.body.age)

    if(!id){
        res.status(400).send("You did not provide a valid Id")
    }

    if(typeof id !=="number"){
        res.status(400).send({message:"Id must be a number"})
        return
    }

    if(id<0){
        res.status(400).send({message:"Id must be a positive number"})
        return
    }


    const index = userList.findIndex((user)=>{
        return user.id === id
    })

    if(!index){
        res.status(400).send({message:"Invalid ID"})
    }

    if(name){
        userList[index].name = name
    }
    if(age){
        userList[index].age = age
    }

    res.status(200).send("Resource was successfully modified")
})

app.delete("/users/:id",(req,res)=>{
    const id = req.params.id
    if(!id){
        res.status(400).send("You did not provide a valid Id")
    }

    if(typeof id !=="number"){
        res.status(400).send({message:"Id must be a number"})
        return
    }

    if(id<0){
        res.status(400).send({message:"Id must be a positive number"})
        return
    }

    const index = userList.findIndex((user)=>{
        return user.id === id
    })

    if(!index){
        res.status(400).send({message:"Invalid ID"})
    }

    userList.splice(index,1)
    res.status(200).send("Resource was successfully deleted")
})


app.get("/posts",async (req,res)=>{
    try{
        const pokemon = await axios.get("https://pokeapi.co/api/v2/pokemon/charizard")
        res.status(200).json(pokemon.data)
    }catch(e){
        res.status(400).send(e)
    }
})


// GET /users: Retrieve all users.
//     GET /users/:id: Retrieve a user by ID.
//     POST /users: Create a new user.
// PUT /users/:id: Update a user by ID.
//     DELETE /users/:id: Delete a user by ID.




app.listen(3000,()=>{
    console.log("Listening on port 3000")
})
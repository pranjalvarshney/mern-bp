const express = require('express')
const app =  express()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const User = require('./models/user')

app.use(cookieParser())
app.use(express.json())

const uri = 'mongodb://localhost:27017/mernlogin'
mongoose.connect( uri , {useNewUrlParser:true , useUnifiedTopology:true} , ()=>{
    console.log("Database successfully connected...")
})

const userInput = {
    username: "ahasjdkl",
    password: "asldkajsld",
    role: "admin"
}

const user = new User(userInput)
user.save((err,document)=>{
    if(err){
        console.log(err)
    }else{
        console.log(document)
    }
})

const port = process.env.PORT
app.listen(port, ()=>{
    console.log(`Server started at : ${port}`)
})
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

// creating modular routes using express.Router()
const userRouter = require('./routes/User')
app.use('/user',userRouter)

const port = process.env.PORT
app.listen(port, ()=>{
    console.log(`Server started at : ${port}`)
})
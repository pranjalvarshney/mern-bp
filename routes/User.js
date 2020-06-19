const express = require('express')
const userRouter = express.Router()
const passport = require('passport')
const passportConfig = require('../passport')  // using the passport configurations - LocalStrategy
const User = require('../models/user')
const Todo = require('../models/todo')
const JWT = require('jsonwebtoken')

userRouter.post('/signup',(req,res)=>{
    const {username,password,role} = req.body
    User.findOne({username: username},(err,user)=>{
        if(err){
            res.status(500).json({message: {
                msgBody: "Error has occured - might be an internal server Error",
                msgError: true
            }})
        }
        if(user){
            res.status(400).json({message: {
                msgBody: "User already exists",
                msgError: true
            }})
        }else{
            // const newUser = new User({
            //     username:username,
            //     password: password,
            //     role: role
            // })
            const newUser = new User({username,password,role})
            newUser.save(err => {
                if(err){
                    res.status(500).json({message: {
                        msgBody: "Internal Server Error occured",
                        msgError: true
                    }})
                }else{
                    res.status(201).json({message: {
                        msgError: false,
                        msgBody: "Account has been successfully created"
                    }})
                }
            })

        }
    })
})

module.exports = userRouter
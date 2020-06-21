const express = require('express')
const userRouter = express.Router()
const passport = require('passport')
const passportConfig = require('../passport')  // using the passport configurations - LocalStrategy
const User = require('../models/user')
const Todo = require('../models/todo')
const JWT = require('jsonwebtoken')
const { session } = require('passport')
const user = require('../models/user')

const signToken = userID => {
    return JWT.sign({
        iss: "developer",
        sub: userID
    },process.env.secretOrKey,{expiresIn: "1h"})
}

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

userRouter.post('/signin',passport.authenticate('local',{session:false}),(req,res)=>{
    if(req.isAuthenticated()){
        const {_id, username,role} = req.user 
        const token = signToken(_id)
        res.cookie('access_token',token,{httpOnly:true,sameSite:true}) // httponly - preventing XSS //samesite - preventing CSRF attacks (protecting the jwt token) 
        res.status(200).json({isAuthenticated:true, user: {username,role}})
    }
})

userRouter.get('/logout',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.clearCookie('access_token')
    res.json({user:{
        username: '',
        role: '',
    },
    success:true
    })
})

userRouter.post('/todo',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const todo = new Todo({
        name: req.body.name
    })
    todo.save(err => {
        if(err){
            res.status(500).json({message: {msgBody:'Error has occured', msgError: true}})
        }else{
            req.user.todos.push(todo)
            req.user.save(err=> {
                if(err){
                    res.status(500).json({message: {msgBody:'Error has occured', msgError: true}})
                }else{
                    res.status(200).json({message: {msgBody: "Successfully created", msgError:false}})
                }
            })
        }
    })
})

userRouter.get('/todos',passport.authenticate('jwt',{session:false}),(req,res)=>{
    User.findById({_id: req.user._id}).populate('todos').exec((err,document)=>{
        if(err){
            res.status(500).json({message: {msgBody:'Error has occured', msgError: true}})
        }else{
            res.status(200).json({todos: document.todos, authenticated: true})
        }
    })
})

userRouter.get('/admin',passport.authenticate('jwt',{session:false}),(req,res)=>{
    if(req.user.role === 'admin'){
        res.status(200).json({message: {msgBody:'You are admin', msgError: false}})
    }else{
        res.status(403).json({message: {msgBody:'No you are not authorized as admin', msgError: true}})
    }    
})

userRouter.get('/authenticated',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const {username,role} = req.user
    res.status(200).json({isAuthenticated: true, user: {username,role}})
})


module.exports = userRouter
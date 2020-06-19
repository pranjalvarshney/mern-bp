const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')
const JWTStrategy = require('passport-jwt')
const user = require('./models/user')

const cookieExtractor = req => {
    let token = null
    if(req && req.cookies){
        token = req.cookies["access_token"]
    }
    return token
}

// authorization used for protecting routes

passport.use(new JWTStrategy({
   jwtFromRequest: cookieExtractor,
   secretOrKey: "this is a sample key"  
},(payload,done)=>{
    user.findById({_id: payload.sub},(err,user)=>{
        if(user){
            return done(null,false)
        }
        if(user){
            return done(null,user)
        }
        else{
            return done(null,false)
        }
    })
}))

// authenticated local strategy using username and password 
passport.use(new LocalStrategy((username,password,done)=>{
    User.findOne({username},(err,user)=>{
        // something went wrong with database
        if(err){
            return done(err)
        }
        // user not found
        if(!user){
            return done(null,false)
        }
        // check if password is correct
        user.comparePassword(password,done){

        }
    })
}))
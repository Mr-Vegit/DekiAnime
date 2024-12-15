const { authenticate } = require("passport")
const localStrategy = require("passport-local").Strategy
const passportLocalMongoose = require("passport-local-mongoose");
const bcrypt = require("bcrypt")
const Users = require('./userSchema');
function initialize(passport) {
    const authenticateUser =async (email,password,done)=>{
        const user = await Users.findOne({email:email});
        if (user==null) {
            return done(null,false,{message:'No user with that email found'})
        }
        try {
            if (await bcrypt.compare(password,user.password)) {
                return done(null,user)
            }else{
                return done(null,false,{message:'Password is incorrect'})
            }
            
        } catch (e){
            return done(e)
        }
    }
    passport.use(new localStrategy({usernameField:"email"},authenticateUser))
    passport.serializeUser((user,done)=>done(null,user.id))
    passport.deserializeUser(async(id,done)=>{
       return done(null,await Users.findById(id))
    })
};
module.exports = initialize;
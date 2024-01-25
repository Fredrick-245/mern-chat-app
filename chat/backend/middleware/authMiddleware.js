const jwt = require("jsonwebtoken");
const User  = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req,res,next)=>{
    let token;
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
        ){
            try {
                token = req.headers.authorization.split(" ")[1];
                console.log(token);
                const decodedToken = jwt.verify(token,process.env.JWT_SECRETE)
                req.user =  User.findById(decodedToken.id).select("-password")
                next()

            } catch(err){
                res.status(401)
                throw new Error("Not authorized,Please login again-Token failed")

            }
        }
    
    if(!token){
        res.status(401)
        throw new Error("Not authorized,Log In and try again")
    }
    
})

module.exports = {protect}
const jwt= require('jsonwebtoken')
const User=require('../models/users')

const auth= async (req,res,next)=>{
    try{
       
        const token=req.header('Authorization').replace('Bearer ','')
       
        const decoded= await  jwt.verify(token, process.env.JWT_TOKEN)
       
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})
       
        if(!user)
         {
           
             throw new Error('authentication error')
         }

         req.user=user
         req.token=token

         next()
    }catch(e){
        console.log("gjvjb`")
        res.status(400).send(e.toString())
    }

}

module.exports= auth
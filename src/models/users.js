const mongoose=require('mongoose')
const validator=require('validator')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowecase:true,
        trim:true,
        validate(value){
            if(value==='')
            {
                throw new Error('name cannot be space')
            
           }
        }
     },
     email:{
        type:String,
        lowercase:true,
        trim:true,
       
        unique:true,
        
        validate(value)
        {
            
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        },
        required:true
     },
     password:{
        type:String,
        validate(value){
            if(value.toLowerCase().includes('password'))
            {
                throw new Error('password field cannot contain password')
            }
        },
        minlength: 7,
        required:true
     },
    age:{
        type:Number,
        validate(value){
            if(value<0)
            throw new Error('age cannot be negative')
        },
        default:0
    },
    tokens:[
        {
            token:{
                type:String,
              required:true
            }
        }
    ],
    avatar:{
        type:Buffer
    }
},{
   
    timestamps:true
})

userSchema.methods.jwtToken= async function (){
    const token=jwt.sign({_id:this._id.toString()},process.env.JWT_TOKEN)
    //console.log(token)

    this.tokens=this.tokens.concat({token:token})
    await this.save()

    return token

}

userSchema.methods.toJSON= function(){
    const userObject= this.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}
userSchema.statics.matchEmail=async function(email,password) 
{ 
  var user  

         user= await this.findOne({ email:email})
        console.log(user)
        if(!user)
        {   console.log('inside try if')
            throw new Error("Email did not match")
        }
    


   // console.log('running')
   
    const isMatch= await bcryptjs.compare(password,user.password)
   
    //console.log(isMatch)
    if(!isMatch)
    { console.log('inside match')
        throw new Error("Wrong Password")
    }
   

    return user
}

userSchema.virtual('myTasks',
{
    ref:'task',
    localField:'_id',
    foreignField:'owner'

}
)

//hash plane word password
userSchema.pre('save',async function(next){
 if(this.isModified('password'))
 {
     this.password=await bcryptjs.hash(this.password,8)
 }
next()
})

//removing all task when user log out
userSchema.pre('remove',async function(next){
    await Task.deleteMany({owner:this._id})
    next()
})

const User=mongoose.model('User',userSchema)

module.exports=User
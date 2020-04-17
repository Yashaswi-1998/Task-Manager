const mongoose=require('mongoose')

const userSchema= new mongoose.Schema(
    {
        description:{
            type:String,
            required:true,
            trim:true
        },
        completion:{
            type:Boolean,
            default:false
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'User'
    
        }
    },{
        timestamps:true
    })

const task=mongoose.model('task',userSchema)

module.exports=task
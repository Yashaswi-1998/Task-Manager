const express=require('express')
const Task= require('../models/task.js')
const auth =require('../middleware/auth')
const User=require('../models/users')

const router=new express.Router()



router.post('/task',auth, async (req,res)=>
{
   // const task=new Task(req.body)
     try{

         const task=new Task({
             ...req.body,  //Es6 notaion
              owner:req.user._id           
         })
          await task.save()
         res.status(201).send(task)
         }
     catch(e)
         {
         res.status(400).send(e.message)
         }
})

router.patch('/task/:id',auth,async (req,res)=>{
   const _id =req.params.id
   const  updates=Object.keys(req.body)
   const  allowedUpdates=['description','completion']

   const isTrue=updates.every(update=>
    {
    return allowedUpdates.includes(update)
    })


    if(!isTrue)
    {
        return res.status(400).send({Error:'Wrong fields mentioned'})
    }


    try{

        const task= await Task.findOne({_id:_id,owner:req.user._id})
        
       //const task= await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
   
       if(!task)
       {
           return res.status(400).send('Task not found')
       }
       updates.forEach(update=> 
        {
        task[update]=req.body[update]
        })

        await task.save()
        res.send(task)
   }
   catch(e)
   {
       res.status(400).send('Invalid credentials')
   }
   
})
 

   
   
  
   
router.get('/task',auth, async (req,res)=>
{
   
    try{
           //const task=await Task.find()
        const match={}
        const sort={}
        if(req.query.completion)
        {
            match.completion=req.query.completion==="true"
        }
        if(req.query.sortBy)
        {
            const parts=req.query.sortBy.split(':')
            sort[parts[0]]=parts[1]==='desc'?-1:1
        }
            const user=await User.findById(req.user._id)
            await user.populate({
                path:'myTasks',
                match,
               options: {
                    limit:parseInt(req.query.limit),
                    skip:parseInt(req.query.skip),
                    sort
                }
            }).execPopulate()
            //console.log('router get')
            if(user.myTasks.length===0)
            {
                throw new Error('No task created by this user')
            }
            res.send(user.myTasks)
       }
       catch(e)
       {
           res.status(500).send(e.toString())
       }
    
})
   
router.get('/task/:id',auth,async (req,res)=>
{
       const _id=req.params.id
       try{
        const task= await Task.findOne({_id:_id,owner:req.user._id})
        if(!task)
        {
            return res.status(404).send('This task not found')
        }
        res.send(task)
       }
       catch(e){
          res.status(400).send('Wrong credentials')
       }
})
   
router.delete('/task/:id',auth ,async(req,res)=>{
    const _id=req.params.id

    try{
       const task=await Task.findOneAndDelete({_id:_id,owner:req.user._id})


       if(!task)
       {
           res.status(404).send('task not found')
       }
       res.send(task)
    }
    catch(e){
        res.status(400).send('Wrong credentials')
    }
})
  


module.exports=router
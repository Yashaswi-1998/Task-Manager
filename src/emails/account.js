const sgMail=require('@sendgrid/mail')

sgMail.setApiKey(process.env.API_KEY)
const welcomeEmail =async function(email,name){
try{
    await sgMail.send({
    to:email,
    from:'yashaswiagrawal1998@gmail.com',
    subject:'This is Welcome Email',
    text:`Welcome to the app, ${name}. Let me know how you are getting with the app`
})
console.log('3')
}
catch(e)
{   console.log('inside catch')
    console.log(e.message)
}
}

const cancelEmail=async (email,name)=>{
    try{
        await sgMail.send({
        to:email,
        from:'yashaswiagrawal1998@gmail.com',
        subject:'Sorry to see you deleting account',
        text:`Help us ${name} by giving your review `
    })
    //console.log('3')
    }
    catch(e)
    {
        console.log(e.message)
    }

}
module.exports =
{ welcomeEmail,
    cancelEmail
}
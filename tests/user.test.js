const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/users')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Amit',
    email: 'amit@gmail.com',
    password: '1235678',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_TOKEN)
    }]
}
beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()

})

// afterEach(()=>{
//     console.log('afterEach')
// })

test('should sign up a new user', async () => {
   
    const res = await request(app).post('/user').send({
        name: 'Yashaswi',
        email: 'yashaswi@gmail.com',
        password: '12345678'
    }).expect(201)
    // assertion that database was change correctly
   
    const user = await User.findById(res.body.user._id)
    expect(user).not.toBeNull()
     console.log(user)


   // Assertion about the response
    //console.log(res.body)

//     expect(res.body).toMatchObject({
//         user: {
//             name: 'Yashaswi',
//             email: 'yashaswi@gmail.com'
//         },
//         token: user.tokens[0].token

//     })
//     expect(user.password).not.toBe('12345678')
 })

// test('should login  existing user', async () => {
//     const res = await request(app).post('/user/login').send({
//         email: 'amit@gmail.com',
//         password: '1235678'
//     }).expect(200)

//     // console.log(res.body)
//     // const user = await User.findById(userOneId)
//     // expect(res.body.token).toBe(user.tokens[1].token)

// })
// test('should not login non existent user', async () => {
//     await request(app).post('/user/login').send({
//         email: userOne.email,
//         password: '42fev3rgsv'
//     }).expect(400)

// })

// // test('should get profile for user', async () => {
// //     await request(app)
// //         .get('/user/me')
// //         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
// //         .send()
// //         .expect(200)
// // })

// test('should not get profile for unauthenticating user', async () => {
//     await request(app)
//         .get('/user/me')
//         .send()
//         .expect(400)


// })


// test('should delete account', async () => {
//     await request(app)
//         .delete('/user/me')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(200)

//     const user = await User.findById(userOneId)
//     expect(user).toBeNull()
// })

// test('should not delete the user', async () => {
//     await request(app)
//         .delete('/user/me')
//         .send()
//         .expect(400)
// })
// 1、connect to database
// 1.1 import mongoose
const mongoose = require('mongoose')
// 1.2 connect to database
mongoose.connect('mongodb://localhost:27017/jobs', {
    useNewUrlParser: true
})
// 1.3 get connection object
const conn = mongoose.connection
// 1.4 bind connection success listener
conn.on('connected', () => {
    console.log('db connect success')
})

// 2、define Model
// 2.1 Schema (sctucture of document (object))
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    }, // username
    password: {
        type: String,
        required: true
    }, // pwd
    type: {
        type: String,
        required: true
    }, // user type applicant/employer 
    header: {
        type: String
    }, // avatar name
    post: {
        type: String
    }, // position
    info: {
        type: String
    }, // position description
    company: {
        type: String
    }, // company name
    salary: {
        type: String
    }, // salary
})
// 2.2 define collection model
const UserModel = mongoose.model('user', userSchema) // 对应集合 users
// 2.3 export model
exports.UserModel = UserModel

// define chat model
const chatSchema = mongoose.Schema({
    from: {
        type: String,
        required: true
    }, // send user's id
    to: {
        type: String,
        required: true
    }, // receive user's id
    chat_id: {
        type: String,
        required: true
    }, // from and to's string
    content: {
        type: String,
        required: true
    }, // content
    read: {
        type: Boolean,
        default: false
    }, // isread
    create_time: {
        type: Number
    } // create time
})
// define collection model
const ChatModel = mongoose.model('chat', chatSchema)
// export model
exports.ChatModel = ChatModel
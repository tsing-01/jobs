// Testing MongoDB database operations using Mongoose

const md5 = require('blueimp-md5');

// 1. Connect to the database
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
mongoose.connect('mongodb://localhost:27017/jobs_test', {
    useNewUrlParser: true
});
const conn = mongoose.connection;
conn.on('connected', function () {
    console.log('Database connection successful');
});

// 2. Define the schema (describes the structure of the document)
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }, // User type: applicant/employer
    header: {
        type: String
    },
});

// 3. Define the Model (corresponds to a collection, allows CRUD operations)
const UserModel = mongoose.model('user', userSchema); // Collection name: users

// 4. Perform CRUD operations using the Model or its instance

// 4.1 Save data using the save() method
function testSave() {
    // Create an instance of the UserModel
    const userModel = new UserModel({
        username: 'Bob',
        password: md5('123'),
        type: 'applicant'
    });

    // Call the save() method to save the data
    userModel.save(function (error, user) {
        console.log('save()', error, user);
    });
}
// testSave();

// 4.2 Query data using the find()/findOne() methods
function testFind() {
    // Find multiple records
    UserModel.find(function (error, users) {
        console.log('find() - Query multiple records', error, users);
    });

    // Find one record
    UserModel.find({
        _id: '5ccfd73d54058441a01728cd'
    }, function (error, user) {
        console.log('find() - Query one record', error, user);
    });

    // Find one record
    UserModel.findOne({
        _id: '5ccfd73d54058441a01728cd'
    }, function (error, user) {
        console.log('findOne() - Query one record', error, user);
    });
}
// testFind();

// 4.3 Update data using the findByIdAndUpdate() method
function testUpdate() {
    UserModel.findByIdAndUpdate({
            _id: '5ccfd73d54058441a01728cd'
        }, {
            username: 'Tom22'
        },
        function (error, oldUser) {
            console.log('findByIdAndUpdate()', error, oldUser);
        }
    );
}
// testUpdate();

// 4.4 Delete data using the remove() method
function testDelete() {
    UserModel.remove({
        _id: '5ccfd73d54058441a01728cd'
    }, function (error, doc) {
        console.log('remove()', error, doc);
    });
}
// testDelete();
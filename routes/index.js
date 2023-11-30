var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5');
const { UserModel, ChatModel } = require('../db/models.js');
const filter = { password: 0 }; // Filter out specified attributes during query (i.e., do not return password)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
1. Successful registration returns: { code: 0, data: { _id: 'abc', username: 'xxx', password: '123' } }
2. Failed registration returns: { code: 1, msg: 'This user already exists' }
*/
// User registration
router.post('/register', function(req, res) {
  const { username, password, type } = req.body;
  // Check if the username already exists
  UserModel.findOne({ username: username }, function(error, user) {
    if (user) { // User exists
      res.send({ code: 1, msg: 'This user already exists' });
    } else {
      // Add a new user
      const userModel = new UserModel({ username: username, password: md5(password), type: type });
      userModel.save(function(error, user) {
        // Generate a cookie (userid: user._id) and save it in the browser
        res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 });
        // Return JSON data containing user information
        const data = { username: username, type: type, _id: user._id }; // Do not return the password
        res.send({ code: 0, data: data });
      });
    }
  });
});

// User login
router.post('/login', function(req, res) {
  const { username, password } = req.body;
  // Query the database (users) based on username and password (password is filtered out in the result)
  UserModel.findOne({ username: username, password: md5(password) }, filter, function(err, user) {
    if (user) { // Login successful
      // Generate a cookie and save it in the browser
      res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 });
      res.send({ code: 0, data: user });
    } else {
      res.send({ code: 1, msg: 'Incorrect username or password' });
    }
  });
});

// Update user information
router.post('/update', function(req, res) {
  // Get userid from the request's cookie
  const userid = req.cookies.userid;
  // If it does not exist (cookie in the browser has been deleted)
  if (!userid) {
    res.send({ code: 1, msg: 'Please log in first' });
    return;
  }
  const user = req.body;
  UserModel.findByIdAndUpdate({ _id: userid }, user, function(error, oldUser) {
    if (!oldUser) { // Cookie has been tampered with
      // Delete the cookie
      res.clearCookie('userid');
      // Return a prompt message
      res.send({ code: 1, msg: 'Please log in first' });
    } else {
      // Prepare a data object for the returned user
      const { _id, username, type } = oldUser;
      const data = Object.assign(user, { _id, username, type });
      // Return
      res.send({ code: 0, data });
    }
  });
});

// Get user information
router.get('/user', function(req, res) {
  // Get userid from the request's cookie
  const userid = req.cookies.userid;
  // If it does not exist, directly return a prompt message
  if (!userid) {
    return res.send({ code: 1, msg: 'Please log in first' });
  }
  // Query the corresponding user based on userid
  UserModel.findOne({ _id: userid }, filter, function(error, user) {
    res.send({ code: 0, data: user });
  });
});

// Get a list of big shots or bosses based on type
router.get('/userlist', function(req, res) {
  const { type } = req.query;
  UserModel.find({ type }, filter, function(error, users) {
    res.send({ code: 0, data: users });
  });
});

// Get all related chat information for the current user
router.get('/msglist', function(req, res) {
  // Get userid from the cookie in the request
  const userid = req.cookies.userid;
  // Query all user document arrays
  UserModel.find(function(err, userDocs) {
    // Use an object to store all user information: key is user's _id, val is a user object consisting of name and header
    const users = {}; // Object container
    userDocs.forEach(doc => {
      users[doc._id] = { username: doc.username, header: doc.header };
    });
    // Query all chat information related to userid (messages I sent or received)
    ChatModel.find({ '$or': [{ from: userid }, { to: userid }] }, filter, function(err, chatMsgs) {
      // Return data containing all users and all chat information related to the current user
      res.send({ code: 0, data: { users, chatMsgs } });
    });
  });
});

// Mark a specific message as read
router.post('/readmsg', function(req, res) {
  // Get from and to from the request
  const from = req.body.from;
  const to = req.cookies.userid;
  // Update the chat data in the database (including: multi:true specifies whether to update multiple entries. By default, only one entry is updated)
  ChatModel.update({ from, to, read: false }, { read: true }, { multi: true }, function(err, doc) {
    console.log('/readmsg', doc);
    res.send({ code: 0, data: doc.nModified }); // Number of updates
  });
});

module.exports = router;

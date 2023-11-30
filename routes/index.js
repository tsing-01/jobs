const express = require('express');
const router = express.Router();
const md5 = require('blueimp-md5');
const { UserModel } = require('../db/models.js');
const filter = { password: 0 }; // Filter out specified attributes during query (i.e., do not return password)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
1. Successful registration returns: { code: 0, data: { _id: 'abc', username: 'xxx', password: '123' } }
2. Failed registration returns: { code: 1, msg: 'This user already exists' }
*/
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


module.exports = router;

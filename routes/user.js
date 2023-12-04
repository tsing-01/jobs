const express = require('express');
const router = express.Router();
const filter = { password: 0 }; 
const { UserModel } = require('../db/models.js');


// Update user information
router.post('/update', function(req, res) {
  // Get userid from the request's cookie
  const userid = req.headers['jobs-token'];
  // If it does not exist (cookie in the browser has been deleted)
  if (!userid) {
    res.send({ code: 1, msg: 'Please log in first' });
    return;
  }
  const user = req.body;
  UserModel.findByIdAndUpdate({ _id: userid }, user, function(error, oldUser) {
    if (!oldUser) { // Cookie has been tampered with
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
router.get('/info', function(req, res) {
  // Get userid from the request's cookie
  const userid = req.headers['jobs-token'];
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
router.get('/list', function(req, res) {
  const { type } = req.query;
  UserModel.find({ type }, filter, function(error, users) {
    res.send({ code: 0, data: users });
  });
});

module.exports = router;
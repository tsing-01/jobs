const express = require('express');
const router = express.Router();
const  filter = { password: 0 }; 
const { UserModel, ChatModel } = require('../db/models.js');

// Get all related chat information for the current user
router.get('/messages', function(req, res) {
  // Get userid from the cookie in the request
  const userid = req.headers['jobs-token'];
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
router.post('/isread', function(req, res) {
  // Get from and to from the request
  const from = req.body.from;
  const to = req.headers['jobs-token'];
  // Update the chat data in the database (including: multi:true specifies whether to update multiple entries. By default, only one entry is updated)
  ChatModel.update({ from, to, read: false }, { read: true }, { multi: true }, function(err, doc) {
    res.send({ code: 0, data: doc.nModified }); // Number of updates
  });
});

module.exports = router;

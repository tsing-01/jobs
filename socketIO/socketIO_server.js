const {
  ChatModel
} = require('../db/models');
module.exports = function (server) {
  // Get the IO object
  const io = require('socket.io')(server);
  io.set('transports', ['websocket']); // use websocket to transport data
  io.set('origins', 'https://jobs-server-jobs-server-online.up.railway.app/*'); // set origins
  // Monitor connections (callback when a client connects)
  io.on('connection', function (socket) {
    // Bind the sendMsg listener to receive messages sent by the client
    socket.on('sendMsg', function ({
      from,
      to,
      content
    }) {
      console.log('Server received a message from the browser', {
        from,
        to,
        content
      });
      // Process data (save the message)
      // Prepare relevant data for the chatMsg object
      const chat_id = [from, to].sort().join('_'); // from_to or to_from
      const create_time = Date.now();
      // Save data to the database
      new ChatModel({
        from,
        to,
        content,
        chat_id,
        create_time
      }).save(function (error, chatMsg) {
        if (error) {
          console.log(error);
          return;
        }
        // Send messages to all connected clients (mainly to the target client)
        io.emit('receiveMsg', chatMsg); // This is not the best practice, as it sends to all connected clients. But it's the simplest implementation.
      });
    });
  });
};
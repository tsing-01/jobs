module.exports = function(server) {
    // get io object
    const io = require('socket.io')(server)
    // listen to connection event
    io.on('connection',function(socket){
        console.log('socketio connected')
        // bind receive message listener
        socket.on('sendMsg',function(data){
            console.log('receive msg from client:',data)
            // send message to client
            io.emit('receiveMsg',data.name + '_' + data.data) // send message to all clients
            // socket.emit('receiveMsg',data.name + '_' + data.data) // send message to current client
            console.log('receive msg from server',data)
        })
    })
}
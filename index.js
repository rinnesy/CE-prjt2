//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);


/*-- Public socket connection --*/
//Listen for individual clients/users to connect
io.sockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);

    //Listen for a message named 'msg' from this client
    socket.on('data', function(data) {
        //Data can be numbers, strings, objects
        console.log("Received 'data': " + data);

        //Send a response to all other clients, not including this one
        socket.broadcast.emit('data', data);
    });

    //Listen for this client to disconnect
    socket.on('disconnect', () => {
        console.log("A client has disconnected: " + socket.id);
    });
});
/*-- end public namespace --*/


/* -- Private socket namespace --*/
// initialize unique namespace
let private = io.of('/private');
//Listen for individual clients/users to connect 
private.on('connection', (socket) => {
    console.log("Private Namespace Connection");
    console.log("We have a new privateclient: " + socket.id);

    // listen for room name
    socket.on('room-name', (data) => {
        console.log(data);

        // add socket to room
        socket.join(data.room);

        // add room property to socket
        socket.room = data.room;

        // send a welcome msg
        let welcomeMsg = "Welcome to '" + data.room + "'room!";
        // private.to(socket.room).emit('joined', {msg: welcomeMsg});
        // send the message to new user ONLY
        socket.emit('joined', {msg: welcomeMsg});
    })

    //Listen for a message named 'msg' from this client
    socket.on('data', (data) => {
        //Data can be numbers, strings, objects
        console.log("Received 'data': " + data);

        //Send a response to all clients ONLY in private room
        private.to(socket.room).emit('data', data);
    });

    //Listen for this client to disconnect
    socket.on('disconnect', () => {
        console.log("A client has disconnected: " + socket.id);

        // leave the room
        socket.leave(socket.room);
    });
});
/*-- end private name space --*/
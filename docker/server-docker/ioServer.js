let http = require('http');
let fs = require('fs');
const uuidv4 = require('uuid/v4');

global.log4us = require('./src/utils/log4us')();
let connection = require('./src/utils/connections');

const PORT =1617;

// Loading the index file . html displayed to the client
let server = http.createServer(function(req, res) {});

// Loading socket.io
let io = require('socket.io').listen(server);

// When a client connects, we note it in the console
io.sockets.on('connection', function (socket) {
	  let clientId=uuidv4();
    global.log4us.log(`Client ${clientId} has connected.`);

    socket.on('disconnect', function(){
    	global.log4us.log(`Client ${clientId} has disconnected`);
  	});
  	socket.on('nodeClicked', function(msg){
    	global.log4us.print(`Received from ${clientId} :  ${msg}`);
    	socket.emit('changeNode',msg);
  	});

    socket.on('teamClick', function(msg){
      global.log4us.print(`Team Received from ${clientId} :  ${msg}`);
      connection.updateTeam(msg);
      socket.broadcast.emit('teamUpdate',msg);
    });

    socket.on('createConnection', function(msg){
      global.log4us.print(`Creating connection from ${clientId} :  ${msg}`);
      connection.createConnection(clientId,msg);
    });

    socket.on('joinConnection', function(msg){
      global.log4us.print(`Joining connection :  ${msg}`);
      let result = connection.connectToConnection(msg,clientId);
      if(result.success){
        socket.emit('teamUpdate',result.currentSearch);
        console.log("Emitted!", result.currentSearch);
      }
    });

		socket.on('methodClicked', function(msg){
    	global.log4us.print(`Received from ${clientId} :  ${msg}`);
    	//socket.emit('changeNode',msg);
  	});
		/*process.stdin.on('data',function(msg){
			socket.emit('changeNode', `${msg}`);
      global.log4us.print(`Sending: ${msg}`);
    });*/
});


server.listen(PORT);
global.log4us.log(`Server started at port: ${PORT}`);
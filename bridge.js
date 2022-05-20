let express = require('express')
var osc = require('node-osc');
var io = require('socket.io')(8081);

var oscServer, oscClient;

var isConnected = false;

let app = express();
let server = app.listen(3000);
app.use(express.static('public'));



io.sockets.on('connection', function (socket) {
	console.log('connection');
	socket.on("config", function (obj) {
		isConnected = true;
    	oscServer = new osc.Server(obj.server.port, obj.server.host);
	    oscClient = new osc.Client(obj.client.host, obj.client.port);
	    oscClient.send('/status', socket.sessionId + ' connected');
		oscServer.on('message', function(msg, rinfo) {
			socket.emit("message", msg);
		});
		socket.emit("connected", 1);
	});

  socket.on("pose", function (value) {
		let miPosX = value[1]
		let miPosY = value[2]
    oscClient.send(value[0],[miPosX, miPosY])
  })

	socket.on('disconnect', function(){
		if (isConnected) {
			oscServer.kill();
			oscClient.kill();
		}
  	});
});

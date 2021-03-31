var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require("path");
var port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, "public")));

app.get("*", function(req,res,next) {
	res.redirect("/");
});

let usersDict = {};
let usersCount = 0;

 
io.on('connection', function(socket){
	const user = socket.handshake.query.name;
	const from = socket.id;

	usersDict[from] = user;
	usersCount += 1;
	
	socket.on('chat_message_sent', function(msg){
		io.emit('chat_message_received', { ...msg, user, from});
	});

	socket.on('disconnect', function(msg){
		delete usersDict[from];
		usersCount -= 1;
		console.log('usersDict: ', usersDict);
		console.log('count ', usersCount);
		io.emit('member_exit', { from, user });
	});

	console.log('usersDict: ', usersDict);
	console.log('count ', usersCount);
	io.emit('new_member', { from, user });
});

http.listen(port, function(){
  console.log('Open your browser on http://localhost:' + port);
});




var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var syncs = [];

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
    socket.on('sync', function(msg){
        
        syncs.push(msg);
        socket.broadcast.emit('sync', msg);
    });
});
/*var handler = function(req, res) {
    fs.readFile('./index.html', function (err, data) {
        if(err) throw err;
        res.writeHead(200);
        res.end(data);
    });
}
var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var Moniker = require('moniker');
var port = process.env.PORT || 5000;
app.listen(port);*/
//////////////////////
var Moniker = require('moniker');
var port = process.env.PORT || 5000;

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(port);
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
//////////////////////////

console.log('Working!');
io.sockets.on('connection', function (socket) {
    var user = addUser();
    updateWidth();
    socket.emit("welcome", user);
    socket.on('disconnect', function () {
        removeUser(user);
    });
    socket.on("click", function() {
        currentWidth += 1;
        user.clicks += 1;
        updateWidth();
        socket.emit("updateUsers",{userclick: user.clicks});
    });
    socket.on("get_name", function(data) {
        user.name = data.username;
        socket.emit("welcome",user);
    });
});

var initialWidth = 50;
var currentWidth = initialWidth;
var user_count = 0;

var addUser = function() {
    var user = {
        name: Moniker.choose(),
        clicks: 0
    }
    user_count += 1;
    io.sockets.emit("usercount", { user_count: user_count });
    return user;
}
var updateWidth = function() {
    io.sockets.emit("update", { currentWidth: currentWidth });
}
var removeUser = function(user) {
    user_count -= 1;
    io.sockets.emit("usercount", { user_count: user_count });
}
/*var pg = require('pg');

pg.connect(process.env.DATABASE_URL, function(err, client) {
 var query = client.query('CREATE TABLE MUSTAFA (ID INT PRIMARY KEY NOT NULL,AGE INT NOT NULL);');
 //client.query('INSERT INTO MUSTAFA (ID,AGE) VALUES (1,27);');
 query.on('row', function(row) {
    console.log(JSON.stringify(row));
  });
});*/

/*
var handler = function(req, res) {
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
app.listen(port);
*/

/*Server Creation with Express*/

var Moniker = require('moniker');
var port = process.env.PORT || 5000;
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(port);
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

/*End of Server Creation with Express*/

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
        updateUsers();
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
var users = [];

var addUser = function() {
    var user = {
        name: Moniker.choose(),
        clicks: 0
    }
    user_count += 1;
    io.sockets.emit("usercount", { user_count: user_count });
    users.push(user);
    updateUsers();
    return user;
}
var updateWidth = function() {
    io.sockets.emit("update", { currentWidth: currentWidth });
}
var updateUsers = function() {
    var str = '';
    for(var i=0; i<users.length; i++) {
        var user = users[i];
        str += user.name + ' <small>(' + user.clicks + ' clicks)</small>';
    }
    io.sockets.emit("users", { users: str });
}
var removeUser = function(user) {
    user_count -= 1;
    io.sockets.emit("usercount", { user_count: user_count });
    for(var i=0; i<users.length; i++) {
        if(user.name === users[i].name) {
            users.splice(i, 1);
            updateUsers();
            return;
        }
    }
}
/*var pg = require('pg');

pg.connect(process.env.DATABASE_URL, function(err, client) {
 var query = client.query('CREATE TABLE MUSTAFA (ID INT PRIMARY KEY NOT NULL,AGE INT NOT NULL);');
 //client.query('INSERT INTO MUSTAFA (ID,AGE) VALUES (1,27);');
 query.on('row', function(row) {
    console.log(JSON.stringify(row));
  });
});*/

var express = require('express');
var http = require('http');
var https = require('https');
var syncSql = require('sync-sql');
var fs = require('fs');
var socketIo = require('socket.io');


var config = JSON.parse(fs.readFileSync("config/config.json"));
var blackList = JSON.parse(fs.readFileSync("config/blackList.json"));

var app = express();
if (!config.https) {
    var server = http.Server(app);
    if (!config.ip) {
        server.listen(80);
    } else {
        server.listen(80, config.ip);
    }  
} else {
    var serverhttp = http.createServer(function (req, res) {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        res.end();
    });
    if (!config.ip) {
        serverhttp.listen(80);
    } else {
        serverhttp.listen(80, config.ip);
    }  

    var server = https.createServer({
        key: fs.readFileSync(config.SSL.key),
        cert: fs.readFileSync(config.SSL.cert),
        ca: fs.readFileSync(config.SSL.ca)
    }, app);
    if (!config.ip) {
        server.listen(443);
    } else {
        server.listen(443, config.ip);
    }  
}

var io = socketIo(server);
app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(fs.readFileSync("pages/index.html"));
    res.end();
});

function login(login, password) {
    login = login.trim();
    password = password.trim();
    if (getUserId(login))
        return "Already logged in!!!";

    var output = syncSql.mysql(config.database, "SELECT * FROM `users` WHERE `login` = '" + login + "' AND `password` = '" + password + "'");

    if (output.data.rows.length > 0)
        return true;

    return "Bad Login/Password!!!";
}

function register(login, password) {
    login = login.trim();
    password = password.trim();
    if (login.length < 4 && login.length > 10 && password.length < 4 && password.length > 10)
        return "4 to 10 characters!!!";
    if (isBlackList(login))
        return "Your nickname is blacklisted!!!";
    var output = syncSql.mysql(config.database, "SELECT * FROM `users` WHERE `login` = '" + login + "'");

    if (output.data.rows.length != 0)
        return "Someone use this nickname!!!";

    if (getUserId(login))
        return "Someone use this nickname(Guest)!!!";

    var output = syncSql.mysql(config.database, "INSERT INTO `users` VALUES('', '" + login + "', '" + password + "')");

    if (output.success)
        return true;

    return "Unknown Error!!!"
}

function connectGuest(nickname) {
    nickname = nickname.trim();
    if (nickname.length < 4 && nickname.length > 10)
        return "4 to 10 characters!!!";
    if (isBlackList(nickname))
        return "Your nickname is blacklisted!!!";
    var output = syncSql.mysql(config.database, "SELECT * FROM `users` WHERE `login` = '" + nickname + "'");

    if (output.data.rows.length != 0)
        return "Someone use this nickname!!!";

    if (getUserId(nickname))
        return "Someone use this nickname!!!";

    return true;
}
function user(socketID, nickname, registered) {
    this.socketId = socketID;
    this.nickname = nickname;
    this.registered = registered;
    this.calling = false;
}
var users = new Array();
function updateUserList() {
    var nicknames = new Array();
    for (var key in users) {
        nicknames.push({ nickname: users[key].nickname, registered: users[key].registered });
    }
    io.sockets.emit('connectedUserList', nicknames);
}
function getUserId(nickname) {
    for (var key in users) {
        if (users[key].nickname.toLowerCase() == nickname.toLowerCase())
            return key;
    }
    return false;
}
function isBlackList(nickname) {
    for (var i = 0; i < blackList.length; i++) {
        if (blackList[i].toLowerCase() == nickname.toLowerCase()) {
            return true;
        }
    }
    return false;
}
io.on('connection', function (socket) {

    socket.emit('iceServer', { iceServers: config.iceServers });
    socket.on("connectGuest", function (nickname) {
        nickname = nickname.replace(/ /g, '');
        var status = connectGuest(nickname);
        if (status == true) {
            socket.emit("connected", nickname);
            users[socket.id] = new user(socket.id, nickname, false);
            updateUserList();
        } else {
            socket.emit("authorizationError", { type: "Guest", details: status });
        }
    });

    socket.on("login", function (data) {
        data.login = data.login.replace(/ /g, '');
        var status = login(data.login, data.password);
        if (status == true) {
            socket.emit("connected", data.login);
            users[socket.id] = new user(socket.id, data.login, true);
            updateUserList();
        } else {
            socket.emit("authorizationError", { type: "Login", details: status });
        }
    });

    socket.on("register", function (data) {
        data.login = data.login.replace(/ /g, '');
        var status = register(data.login, data.password);
        if (status == true) {
            socket.emit("registered");
        } else {
            socket.emit("authorizationError", { type: "Register", details: status });
        }
    });

    socket.on("pokeSend", function (data) {
        io.to(getUserId(data.targetNickname)).emit('pokeReceived', { invokerNickname: users[socket.id].nickname, message: data.message });
    });

    socket.on("messageSend", function (message) {
        socket.broadcast.emit("messageReceived", { invokerNickname: users[socket.id].nickname, message: message });
        socket.emit("messageSended", { invokerNickname: users[socket.id].nickname, message: message });
    });

    socket.on("messageSendPrivate", function (data) {
        io.to(getUserId(data.targetNickname)).emit('messageReceivedPrivate', { invokerNickname: users[socket.id].nickname, message: data.message });
        socket.emit("messageSendedPrivate", { invokerNickname: users[socket.id].nickname, message: data.message, targetNickname: data.targetNickname });
    });

    socket.on("callVoiceRequest", function (nickname) {
        io.to(getUserId(nickname)).emit('callVoiceRequest', users[socket.id].nickname);
    });

    socket.on("callVideoRequest", function (nickname) {
        io.to(getUserId(nickname)).emit('callVideoRequest', users[socket.id].nickname);
    });

    socket.on("callRejected", function (data) {
        io.to(getUserId(data.targetNickname)).emit('callRejected', data.reason);
    });

    socket.on("callVideoAccept", function (nickname) {
        io.to(getUserId(nickname)).emit('callVideoAccept', users[socket.id].nickname);
        users[socket.id].calling = nickname;
        users[getUserId(nickname)].calling = users[socket.id].nickname;
    });

    socket.on("callVoiceAccept", function (nickname) {
        io.to(getUserId(nickname)).emit('callVoiceAccept', users[socket.id].nickname);
        users[socket.id].calling = nickname;
        users[getUserId(nickname)].calling = users[socket.id].nickname;
    });

    socket.on('transmitterOnicecandidate', function (data) {
        io.to(getUserId(data.targetNickname)).emit('transmitterOnicecandidate', data);
    });
    socket.on('receiverOnicecandidate', function (data) {
        io.to(getUserId(data.targetNickname)).emit('receiverOnicecandidate', data);
    });

    socket.on('transmitterCreateOffer', function (data) {
        io.to(getUserId(data.targetNickname)).emit('transmitterCreateOffer', { nickname: users[socket.id].nickname, ct: data.ct });
    });

    socket.on('receiverCreateAnswer', function (data) {
        io.to(getUserId(data.targetNickname)).emit('receiverCreateAnswer', { nickname: users[socket.id].nickname, ct: data.ct });
    });

    socket.on("callStop", function (nickname) {
        io.to(getUserId(nickname)).emit('callStop');
        users[socket.id].calling = false;
        users[getUserId(nickname)].calling = false;
    });

    socket.on('disconnect', function () {
        if (typeof users[socket.id] !== 'undefined') {
            if (users[socket.id].calling)
                io.to(getUserId(users[socket.id].calling)).emit('callStop', users[socket.id].nickname);
            socket.broadcast.emit("disconnectUser", { nickname: users[socket.id].nickname, registered: users[socket.id].registered })      
        }
        delete users[socket.id];
        updateUserList();
    });

});
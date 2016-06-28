var filename="(sever.js)"
var l = console.log
var jwt = require('jsonwebtoken');
var options = {
    secret: "test",
    timeout: 5000, // 5 seconds to send the authentication message
    algorithm: 'HS256'
}
var jwt = require('jsonwebtoken');
var token
const jwtsecret = "test"

var sleep = require('sleep');

const REDIS_HOST = 'localhost';
const REDIS_PORT = '6379';
const redis = require('redis');
var client = redis.createClient();
client.on("error", function(err) {
    console.log("Error " + err);
});

exports = module.exports = function(io) {

    io.on('connection', function(socket) {


        l(filename,"*******socket.io connect*******")


        token = jwt.sign({
            user: 'owner1',
            room: "room1"
        }, jwtsecret);
        socket.emit('jwt-owner1', token);

        // token = jwt.sign({
        //     user: 'owner2',
        //     room: "room2"
        // }, jwtsecret);
        // socket.emit('jwt-owner2', token);

        token = jwt.sign({
            user: 'customer1',
            room: "room1"
        }, jwtsecret);
        socket.emit('jwt-customer1', token);

        // token = jwt.sign({
        //     user: 'customer2',
        //     room: "room1"
        // }, jwtsecret);
        // socket.emit('jwt-customer2', token);

        // token = jwt.sign({
        //     user: 'customer3',
        //     room: "room1"
        // }, jwtsecret);
        // socket.emit('jwt-customer3', token);

        // token = jwt.sign({
        //     user: 'customer4',
        //     room: "room1"
        // }, jwtsecret);
        // socket.emit('jwt-customer4', token);




        delete io.sockets.connected[socket.id];



        var auth_timeout = setTimeout(function() {
            socket.disconnect('unauthorized');
            l(filename,"auth_timeout")
            w("error")
        }, 200000);



        var authenticate = function(data) {
            clearTimeout(auth_timeout);
            jwt.verify(data.token, options.secret, options, function(err, decoded) {
                if (err) {
                    socket.disconnect('unauthorized')
                    l(filename,"authorize failed")
                }
                if (!err && decoded) {
                    io.sockets.connected[socket.id] = socket

                    l(filename,"authorize succeed ")
                    socket.emit('authenticated')

                    l(filename,"auth client socket id:  ", socket.id)
                    l(filename,"jwt payload:  ", decoded)


                    if (decoded.user === "owner1") {
                        client.sadd(decoded["room"], socket.id);
                        l(filename,"you are owner1")
                    } else if (decoded.user === "owner2") {
                        client.sadd(decoded["room"], socket.id);
                        l(filename,"you are owner2")
                    } else {
                        l(filename,"you are customer")
                    }

                    socket.decoded_token = decoded
                    socket.connectedAt = new Date()
                    socket.join(decoded["room"])
                    socket.join("test")


                    socket.on('disconnect', function() {
                        client.srem(decoded.room, socket.id);
                        l(filename,'auth client: disconnected: ', socket.id)
                    })


                    socket.on('customer number', function(channel) {
                        socket.emit('replay customer number', socket.adapter.rooms[decoded["room"]])
                    });


                    socket.on('owner number', function(channel) {
                        client.smembers(decoded["room"], function(err, val) {
                            socket.emit('replay owner number', val);
                        })
                    })


                    socket.on('new message', function(msg) {
                        socket.to('room2').emit('new bc message', msg);
                    });

                    socket.on('new channel', function(channel) {
                        socket.broadcast.emit('new channel', channel)
                    });

                    socket.on('broad', function(channel) {
                        socket.broadcast.emit('new channel', channel)
                    });


                    socket.on('id msg', function(msg) {
                        socket.to(msg[1].id).emit('gg', {
                            test: "msg2 ok"
                        })
                    });




                    socket.on('get room people at o', function() {
                        socket.emit('reply room people at o', socket.adapter.rooms[decoded["room"]])
                    });


                    socket.on('c send msg to all o at c', function(msg) {
                        l(filename,"<<<<<<c send msg to all o at c<<<<<<\n", msg, "<<<<<<c send msg to all o at c<<<<<<\n")
                        l(filename,decoded)
                        let currentDate = new Date();

                        client.smembers(decoded["room"], function(err, messages) {
                            messages.forEach(function(val, index, ar) {
                                socket.to(val).emit('c send msg to all o at o', {
                                    body: msg["body"],
                                    user: decoded["user"],
                                    room: decoded["room"]
                                })
                            })
                        })
                    })



                    socket.on('o send msg to all c at o', function(msg) {
                        l(filename,"<<<<<<o send msg to all c at o<<<<<<\n", msg, "<<<<<<o send msg to all c at o<<<<<<\n")
                        let currentDate = new Date();
                        l(filename,decoded)

                        socket.to(decoded["room"]).emit('o send msg to all c at c', {
                            body: msg["body"],
                            user: decoded["user"],
                            room: decoded["room"]
                        })
                    })


                    socket.on('o send msg to a c at o', function(msg) {
                        l(filename,"<<<<<<o send msg to a c at o<<<<<<\n", msg, "<<<<<<o send msg to a c at o<<<<<<\n")
                        let currentDate = new Date();
                        l(filename,decoded)

                        socket.to(msg["socket_id"]).emit('o send msg to all c at c', {
                            body: msg["body"],
                            user: decoded["user"],
                            room: decoded["room"]
                        })


                    })



                    socket.on('o get initial msg', function() {
                        l(filename,"<<<<<<o get initial msg<<<<<<\n")
                        })


                    socket.on('c get initial msg', function() {
                        l(filename,"<<<<<<c get initial msg<<<<<<\n")
                    });






                }
            })
        }


        socket.on('test', function(channel) {
            l(filename,"no auth test ok")
        });

        socket.emit('socketid', socket.id);

        socket.on('authenticate', authenticate);

    })
};
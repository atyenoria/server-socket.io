var count = 0
var l = console.log

var jwt = require('jsonwebtoken');
var Message = require('./models/Message');
var options = {
    secret: "test",
    timeout: 5000, // 5 seconds to send the authentication message
    algorithm: 'HS256'
}
const jwtsecret = "test"



const REDIS_HOST = 'localhost';
const REDIS_PORT = '6379';
const redis = require('redis');
var  client= redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});


exports = module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log("++++++++socket connect+++++++++++")
        client.set("string key", "string val", redis.print);
        client.set("string key", "string val", redis.print);

        var jwt = require('jsonwebtoken');
        var token1 = jwt.sign({
            user: 'customer',
            room: "test"
        }, jwtsecret );
        l("jwt token1(customer : ",token1)
        var token2 = jwt.sign({
            user: 'owner',
            room: "test"
        }, jwtsecret );
        l("jwt token2(owner : ",token2)
        delete io.sockets.connected[socket.id];



        var auth_timeout = setTimeout(function() {
            socket.disconnect('unauthorized');
            console.log("auth_timeout")
            w("error")
        }, 200000);



        var authenticate = function(data) {
            clearTimeout(auth_timeout);
            jwt.verify(data.token, options.secret, options, function(err, decoded,decode2) {
                if (err) {
                    socket.disconnect('unauthorized')
                    console.log("authorize failed")
                }
                if (!err && decoded) {
                    io.sockets.connected[socket.id] = socket

                    l("authorize succeed ")
                    socket.emit('authenticated')

                    l("auth client socket id:  ",socket.id)
                    l("jwt payload:  ",decoded)


                    if(decoded.user === "owner"){
                        client.sadd(decoded["room"], socket.id);
                        l("you are owner (add owner user id to redis)")
                    }else {
                        l("you are customer")
                    }

                    socket.decoded_token = decoded
                    socket.connectedAt = new Date()
                    socket.join(decoded["room"])
                    socket.join("test")


                    socket.on('disconnect', function() {
                        client.srem(decoded.room, socket.id);
                        l('auth client: disconnected: ', socket.id)
                    })


                    socket.on('customer number', function(channel) {
                        socket.emit('replay customer number', socket.adapter.rooms[decoded["room"]])
                    });


                    socket.on('owner number', function(channel) {
                        client.smembers(decoded["room"], function (err, val) {
                            socket.emit ('replay owner number', val);
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


                    socket.on('customer msg', function(msg) {
                        let currentDate = new Date();
                        console.log(msg)
                        //console.log(msg["id"])
                        console.log(decoded)

                        var Msg = new Message({
                            id: msg["id"],
                            time: msg["time"],
                            body: msg["body"],
                            user: decoded["user"],
                            room: decoded["room"]
                        });

                        Msg.save((err) => {
                            if (err) throw err;
                            console.log('Msg saved successfully');
                        });

                        client.smembers(decoded["room"],function(err, messages){
                            console.log(messages); //replies with all strings in the list

                            messages.forEach(function(val,index,ar){
                                socket.to(val).emit ('customer msg', {
                                    body: msg["body"],
                                    user: decoded["user"],
                                    room: decoded["room"]
                                })


                            });

                        })




                    });


                }
            })
        }

        socket.on('test', function(channel) {
            console.log("no auth test ok")
        });

        socket.emit('socketid', socket.id);

        socket.on('authenticate', authenticate);

    })
};
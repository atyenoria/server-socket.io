var count = 0
var l = console.log

var jwt = require('jsonwebtoken');
var User = require('./models/User');

exports = module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log("++++++++socket connect+++++++++++")

        var jwt = require('jsonwebtoken');
        var token1 = jwt.sign({
            user: 'user1',
            room: "test"
        }, 'test');
        l(token1)

        var token2 = jwt.sign({
            user: 'user2',
            room: "test"
        }, 'test');
        l(token2)

        var token3 = jwt.sign({
            user: 'user3',
            room: "test"
        }, 'test');
        l(token3)


        delete io.sockets.connected[socket.id];

        var options = {
            secret: "test",
            timeout: 5000, // 5 seconds to send the authentication message
            algorithm: 'HS256'
        }

        var auth_timeout = setTimeout(function() {
            socket.disconnect('unauthorized');
            console.log("auth_timeout")
            w("error")
        }, options.timeout || 5000);



        var authenticate = function(data) {
            clearTimeout(auth_timeout);
            jwt.verify(data.token, options.secret, options, function(err, decoded,decode2) {
                if (err) {
                    socket.disconnect('unauthorized');
                    console.log("unauthorized")
                }
                if (!err && decoded) {
                    //restore temporarily disabled connection
                    io.sockets.connected[socket.id] = socket;
                    //console.log(io.sockets.connected[socket.id])
                    console.log(socket.id)
                    console.log("auth ok ")
                    console.log(decoded)
                    console.log(decode2)
                    socket.decoded_token = decoded;
                    socket.connectedAt = new Date();
                    socket.join(decoded.room)
                    // Disconnect listener
                    socket.on('disconnect', function() {
                        console.info('SOCKET [%s] DISCONNECTED', socket.id);
                    });

                    console.info('SOCKET [%s] CONNECTED', socket.id);
                    socket.emit('authenticated');



                    socket.emit('test', {
                        test: "server ok"
                    })
                    socket.emit('socketid', socket.id)
                    console.log(socket.id)
                    socket.on('restart', function(channel) {
                        console.log("client restartd")
                        console.log(socket.adapter.rooms.room2)
                        console.log("client restartd")
                    });

                    socket.on('get room people', function(channel) {
                        console.log("client restartd")
                        console.log(socket.adapter.rooms.room2)
                        console.log("client restartd")
                        socket.emit('replay get room people', socket.adapter.rooms.room2)
                    });

                    socket.on('new message', function(msg) {
                        socket.to('room2').emit('new bc message', msg);
                        console.log(socket.id)
                            // console.log(this.socket.sessionid);
                            // socket.broadcast.emit('new bc message', msg);
                        console.log('new message')
                    });
                    socket.on('new channel', function(channel) {
                        socket.broadcast.emit('new channel', channel)
                    });


                    socket.on('room', function(msg) {
                        console.log('on room')
                        console.log(msg)
                        socket.to('test').emit('room_msg', msg);
                        console.log(socket.id)
                    });

                    socket.on('broad', function(channel) {
                        console.log(channel)
                        socket.broadcast.emit('new channel', channel)
                    });


                    socket.on('test', function(channel) {
                        console.log("on test ok")
                    });


                    socket.on('id msg', function(msg) {
                        console.log(socket.id)
                        console.log("on:id msg")
                        console.log("on:id msg")
                        console.log(msg)
                        console.log(msg[1].id)
                        console.log(msg.id)
                            // socket.to('room2').emit('gg',{test: "msg1 ok"})
                        socket.to(msg[1].id).emit('gg', {
                            test: "msg2 ok"
                        })
                    });

                    socket.on('create msg', function(channel) {


                        let currentDate = new Date();
                        console.log(currentDate)

                        var nick = new User({
                            name: 'test',
                            password: 'password',
                            admin: true
                        });

                        nick.save((err) => {
                            if (err) throw err;
                            console.log('User saved successfully');
                            res.json({
                                success: true
                            });
                        });


                    });


                }
            })
        }

        socket.on('test', function(channel) {
            console.log("on test ok")
        });

        socket.on('authenticate', authenticate);

    })
};
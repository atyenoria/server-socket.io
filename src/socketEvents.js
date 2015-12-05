var count = 0
var l = console.log

var jwt = require('jsonwebtoken');

exports = module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log("++++++++socket connect+++++++++++")


        var jwt = require('jsonwebtoken');
        var token = jwt.sign({
            foo: 'bar'
        }, 'test');
        l(token)



        //temp delete socket from namespace connected map

        delete io.sockets.connected[socket.id];

        var options = {
            secret: "test",
            timeout: 5000 // 5 seconds to send the authentication message
        }

        var auth_timeout = setTimeout(function() {
            socket.disconnect('unauthorized');
            console.log("auth_timeout")
            w("error")
        }, options.timeout || 5000);



        var authenticate = function(data) {
            clearTimeout(auth_timeout);
            jwt.verify(data.token, options.secret, options, function(err, decoded) {
                if (err) {
                    socket.disconnect('unauthorized');
                    console.log("unauthorized")
                }
                if (!err && decoded) {
                    //restore temporarily disabled connection
                    io.sockets.connected[socket.id] = socket;
                    console.log("auth ok ")
                    socket.decoded_token = decoded;
                    socket.connectedAt = new Date();

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

                    socket.on('test', function(channel) {
                        console.log("on test ok")
                    });

                    socket.on('typing', function() {
                        console.log("typing")
                        socket.broadcast.emit('typing bc', socket.username);
                    });
                    socket.on('stop typing', function() {
                        socket.broadcast.emit('stop typing bc', socket.username);
                    });

                    socket.on('id msg', function(msg) {
                        console.log(socket.id)
                        console.log("on:id msg")
                        console.log(msg[0].id)
                            // socket.to('room2').emit('gg',{test: "msg1 ok"})
                        socket.to(msg[0].id).emit('gg', {
                            test: "msg2 ok"
                        })
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
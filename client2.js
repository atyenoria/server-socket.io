var io = require('socket.io-client')
var socket = io.connect("http://localhost:3000", {
    'force new connection': true
})
var l = console.log
l("************************* restart client2**********************")

socket.on('connect', function() {
    socket.on('jwt-customer1', function(data) {
        jwt = data
    })
    setTimeout(function() {
        socket.emit('authenticate', {
            token: jwt
        });
    }, 1500);
})

socket.on('disconnect', function() {
    console.info('SOCKET [%s] DISCONNECTED', socket.id);
});


setTimeout(function() {
    socket.emit('test', {
        test: "data"
    });
}, 1500);
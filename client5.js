var io = require('socket.io-client')
var socket = io.connect("http://192.168.87.35:3000", {
    'force new connection': true
})
var l = console.log
var jwt
l("************************* restart client5**********************")

socket.on('connect', function() {
    socket.on('jwt-customer3', function(data) {
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

setTimeout(function() {}, 1500);
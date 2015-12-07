var io = require('socket.io-client')
var colors = require('colors');
console.log('hello'.green); // outputs green text
var socket = io.connect("http://localhost:3000", {
    'force new connection': true
})
var l = console.log
l("************************* restart client1**********************")
var jwt


//owner
socket.on('connect', function() {
    socket.on('jwt-owner1', function(data) {
        jwt = data
    })
    setTimeout(function() {
        socket.emit('authenticate', {
            token: jwt
        });
    }, 1500);
});


socket.on('disconnect', function() {
    console.info('SOCKET [%s] DISCONNECTED', socket.id);
});
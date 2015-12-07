var token = "jwt-customer1"
console.log("************************* restart client2**********************")


var Chance = require('chance')
var chance = new Chance()
var io = require('socket.io-client')
var socket = io.connect("http://localhost:3000", {
    'force new connection': true
})

var l = console.log
var jwtToken
var strftime = require('strftime')
var options = {
    secret: "test",
    timeout: 5000, // 5 seconds to send the authentication message
    algorithm: 'HS256'
}
var jwt = require('jsonwebtoken');
socket.on('disconnect', function() {
    console.info('SOCKET [%s] DISCONNECTED', socket.id);
});
socket.on('connect', function() {
    l("socket.id:", socket.id)
    socket.on(token, function(data) {
        jwtToken = data
        jwt.verify(jwtToken, options.secret, options, function(err, decoded) {
            // l("jwt-token: ", decoded)
        })

    })
    setTimeout(function() {
        socket.emit('authenticate', {
            token: jwtToken
        });
    }, 300);
});






//===================MAIN====================




var allomsg = chance.sentence({
    words: 3
})
setTimeout(function() {
    var newMessage = {
        id: Date.now(),
        body: allomsg,
        time: strftime('%H:%M %p', new Date())
    };
    l(">>>c send msg to all o at c>>>")
    socket.emit('c send msg to all o at c', newMessage);
}, 500);





setTimeout(function() {

    socket.on('o send msg to all c at c', function(data) {
        l("<<<o send msg to all c at c<<<\n", data, "<<<o send msg to all c at c<<<\n")
    })

}, 1000);





setTimeout(function() {

    socket.on('o send msg to a c at c', function(data) {
        l("<<<o send msg to a c at c<<<\n", data, "<<<o send msg to a c at c<<<\n")
    })

}, 1000);



setTimeout(function() {
    l(">>>c get initial msg>>>")
    socket.emit('c get initial msg')

    socket.on('reply c get initial msg', function(data) {
        l("<<<reply c get initial msg<<<\n", data)
    })
}, 3000);
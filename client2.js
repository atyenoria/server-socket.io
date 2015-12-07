var token = "jwt-customer1"
console.log("************************* restart client2**********************")



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



setTimeout(function() {


    var newMessage = {
        id: Date.now(),
        channelID: "sample",
        text: "text",
        user: "user",
        time: strftime('%H:%M %p', new Date())
    };

    l(">>>c send msg at c>>>")
    socket.emit('c send msg at c', newMessage);


}, 700);





setTimeout(function() {
    var newMessage = {
        id: Date.now(),
        body: "hello owner",
        time: strftime('%H:%M %p', new Date())
    };
    console.log("owner send msg")
    socket.emit('customer send msg', newMessage);
}, 1200);





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
var token = "jwt-owner1"
console.log("************************* restart client1**********************")



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


setTimeout(function() {
    socket.on('c send msg to all o at o', function(data) {
        l("<<<c send msg to all o at o<<<\n", data, "<<<c send msg to all o at o<<<\n")
    })
}, 700);







setTimeout(function() {
    l(">>>get room people at o>>>")
    socket.emit('get room people at o')

    socket.on('reply room people at o', function(data) {
        l("<<<reply room people at o<<<\n", data)
    })

}, 1000);



var allcmsg = chance.sentence({
    words: 3
})
setTimeout(function() {
    var newMessage = {
        id: Date.now(),
        body: allcmsg,
        time: strftime('%H:%M %p', new Date()),
    };
    l(">>>o send msg to all c at o>>>")
    socket.emit('o send msg to all c at o', newMessage);
}, 1200);





var acmsg = chance.sentence({
    words: 2
})
setTimeout(function() {
    var newMessage = {
        id: Date.now(),
        body: acmsg,
        time: strftime('%H:%M %p', new Date()),
        socket_id: "-NdRhXKF5WDwckn-AAAF"
    };
    l(">>>o send msg a c at o>>>")
    socket.emit('o send msg to a c at o', newMessage);
}, 1500);



setTimeout(function() {
    l(">>>o get initial msg>>>")
    socket.emit('o get initial msg')

    socket.on('reply o get initial msg', function(data) {
        l("<<<reply o get initial msg<<<\n", data)
    })
}, 3000);





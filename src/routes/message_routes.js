var Message = require('../models/Message');
var bodyparser = require('body-parser');

module.exports = function(router) {
    router.use(bodyparser.json());

    //query db for messages
    router.get('/messages', function(req, res) {
        console.log("+++++++++++++get messages+++++++++++++")
        console.log(req.user);
        Message.find({}, {
            id: 1,
            channelID: 1,
            text: 1,
            user: 1,
            time: 1,
            _id: 0
        }, function(err, data) {
            if (err) {
                console.log(err);
                console.log('initial message capture')
                return res.status(500).json({
                    msg: 'internal server error'
                });
            }
            res.json(data);
        });
    });

    //post a new message to db
    router.post('/newmessage', function(req, res) {
        // console.log(req)
        var newMessage = new Message(req.body);
        newMessage.save(function(err, data) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    msg: 'internal server error'
                });
            }
            res.json(data);
        });
    });
}
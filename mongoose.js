var mongoose = require('mongoose');
var Message = require('./src/models/Message');



process.env.MONGOLAB_URI = 'mongodb://localhost/chat_app'
mongoose.connect(process.env.MONGOLAB_URI);
// find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
Message.findOne({
    'room': 'room1'
}, 'name occupation', function(err, msg) {
    if (err) return handleError(err);
    console.log(msg)
    return "o"
})
'use strict';

var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    id: String,
    time: String,
    body: String,
    user: String,
    room: String,
    to: String
});

module.exports = mongoose.model('Msg', messageSchema);
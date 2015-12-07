'use strict';

var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    id: String,
    time: String,
    body: String,
    user: String,
    room: String
});

module.exports = mongoose.model('Message', messageSchema);
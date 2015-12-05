'use strict';
const mongoose = require('mongoose');
const messageSchema = mongoose.Schema({
    id: String,
    channelID: String,
    text: String,
    user: String,
    time: String
});
module.exports = mongoose.model('Message', messageSchema);
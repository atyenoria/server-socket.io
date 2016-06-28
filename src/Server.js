//  enable runtime transpilation to use ES6/7 in node
var fs = require('fs');
var babelrc = fs.readFileSync('./src/etc/.babelrc');
try {
    config = JSON.parse(babelrc);
} catch (err) {
    console.error('==>     ERROR: Error parsing your .babelrc.');
    console.error(err);
}
require('babel-core/register')(config);
//###################################################################################


import express from 'express';
const app = express();
import path from 'path';
var http = require('http').Server(app);
import mongoose from 'mongoose'
import morgan from 'morgan'
const PORT = 3000
app.use(morgan(' ":method :url HTTP/:http-version" :status :res[content-length]'))


process.env.MONGOLAB_URI = 'mongodb://192.168.87.35/chat_app';
process.env.PORT = 3000;
mongoose.connect(process.env.MONGOLAB_URI);
process.on('uncaughtException', err => {
    console.log(err);
});




const server = app.listen(PORT, '192.168.87.35', err => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('************ socket.io server on port: %s ************', PORT);
});


//static file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});





//socket.io
const REDIS_HOST = 'localhost';
const REDIS_PORT = '6379';
const io = require('socket.io')(server);
const redis = require('redis').createClient;
const adapter = require('socket.io-redis');
const pub = redis(REDIS_PORT, REDIS_HOST);
const sub = redis(REDIS_PORT, REDIS_HOST);
io.adapter(adapter({
    pubClient: pub,
    subClient: sub
}));


const socketEvents = require('./Events')(io);
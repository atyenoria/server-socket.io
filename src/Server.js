//  enable runtime transpilation to use ES6/7 in node
var fs = require('fs');
var babelrc = fs.readFileSync('./.babelrc');
try {
    config = JSON.parse(babelrc);
} catch (err) {
    console.error('==>     ERROR: Error parsing your .babelrc.');
    console.error(err);
}
require('babel-core/register')(config);





import express from 'express';
const app = express();
import path from 'path';
var http = require('http').Server(app);
import mongoose from 'mongoose'
import session from 'express-session'
import cors from 'cors'
import morgan from 'morgan'
import uuid from 'node-uuid'

const PORT = 3000




//basic middleware
function assignId(req, res, next) {
    req.id = uuid.v4()
    next()
}

morgan.token('id', req => {
    return req.id
})

app.use(assignId)
app.use(morgan(' ":method :url HTTP/:http-version" :status :res[content-length]'))






//passport mongodb
import passport from 'passport';
require('./passport/passport')(passport)
const MongoStore = require('connect-mongo')(session)
process.env.MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/test2';
process.env.PORT = 3000;
mongoose.connect(process.env.MONGOLAB_URI);
app.use(session({
    secret: 'secret',
    store: new MongoStore({
        url: 'mongodb://localhost/sample'
    }),
    cookie: {
        httpOnly: false,
        maxAge: new Date(Date.now() + 60 * 60 * 1000)
    },
    resave: false,
    saveUninitialized: true
}));
process.on('uncaughtException', err => {
    console.log(err);
});
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());




//load routers
const jwt = express.Router();
require('./routes/test')(jwt);
app.use('/jwt', jwt);


// import testrouter from './routes/test'
// app.use('/jwt', testrouter);


const messageRouter = express.Router();
const usersRouter = express.Router();
const channelRouter = express.Router();
require('./routes/user_routes')(usersRouter, passport);
require('./routes/channel_routes')(channelRouter);
require('./routes/message_routes')(messageRouter);
app.use('/api', messageRouter);
app.use('/api', usersRouter);
app.use('/api', channelRouter);


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});






//create server
const server = app.listen(PORT, 'localhost', err => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('************ App Server on port: %s ************', PORT);
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


const socketEvents = require('./socketEvents')(io);

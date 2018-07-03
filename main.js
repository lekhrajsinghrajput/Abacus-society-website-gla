let app = require('koa')();

let koaRouter = require('koa-router');
let cors = require('koa-cors');
let mount = require('koa-mount');
let myBodyParser=require('koa-body');

let render = require('co-ejs');
let path = require('path');
let Constants = require('./constants');

let config = require('./config');
let logger = require('./logger');

let redisUtils = require('./services/redisUtils');
let sessionUtils = require('./services/sessionUtils');

let http = require('http');
let https = require('https');
let fs = require('fs');

let serve = require('koa-static');
app.use(serve('.'));
app.use(serve('static'));


let clearCookie = require('koa-clear-cookie');
app.use(clearCookie());

app.use(cors({
    origin: function (req) {
        return '*';
    },
    allowMethods: ['GET', 'POST']
}));

app.use(function* (next) {
    let sessionId = this.cookies.get("SESSION_ID");
    this.currentUser = yield sessionUtils.getCurrentUser(sessionId);
    let locals = {
        currentUser: this.currentUser,
        title: "Abacus",
        utils: require('./ejsHelpers'),
        enableGoogleAnalyticsTracking: config.enableGoogleAnalyticsTracking
    };

    render(app, {
        root: path.join(__dirname, 'views'),
        layout: false,
        viewExt: 'html',
        cache: false,
        locals: locals,
        debug: false
    });
    yield next;
});

app.use(function *(next){
    try {
        yield next;
    } catch (err) {

        this.type = 'json';
        logger.logError(err);
        this.status = err.status || 500;
        this.body = {'error': 'Some error occured'};
        this.app.emit('error', err, this);

    }
});

app.use(
    myBodyParser({
        formidable:{ uploadDir :'./static/upload/'},
        multipart: true,
        unlencoded:true
    }));



app.use(mount('/', require('./routes/appRoutes')(app)));

module.exports = app;

require('./clusterify')(app);

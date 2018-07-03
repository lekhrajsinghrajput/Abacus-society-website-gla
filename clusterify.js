let cluster = require('cluster');
let config = require('./config');
let http = require('http');
let fs = require('fs');
let os = require('os');
let logger = require('./logger');

module.exports = function(app) {
    if (cluster.isMaster) {
        let numWorkers = os.cpus().length;

        for (let i = 0; i < numWorkers; i++) {
            cluster.fork();
        }

        cluster.on('exit', function (worker, code, signal) {
            logger.logError('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
            cluster.fork();
        });

        /********* Execute startup jobs *******/
        require('./startupJobs');
    } else {
        http.createServer(app.callback()).listen(config.port.http);
    }
};
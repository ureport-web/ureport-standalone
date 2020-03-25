#!/usr/bin/env node
if (process.env.NODE_ENV == undefined) {
  process.env.NODE_ENV = "dev"
}
var config = require('config')
var port = normalizePort(config.PORT || 3000);

console.log("Detected environment " , process.env.NODE_ENV)

if(process.env.NODE_ENV == 'production'){
  port = normalizePort(process.env.PORT|| 3000);
}

try {
    /**
     * Module dependencies.
     */
    var cluster = require('cluster');
    var numCPUs = require('os').cpus().length;

    var app = require('./app');
    var http = require('http');
    app.set('port', port);

    //setup cache
    app.locals.systemSettingCache = require('cluster-node-cache')(cluster, {
      stdTTL: 86400,
      checkperiod: 3600
    });

    app.locals.commonCache = require('cluster-node-cache')(cluster, {
      stdTTL: 72000,
      checkperiod: 3600
    });

    //don't use cluster when it is testing env
    if (process.env.NODE_ENV != undefined && process.env.NODE_ENV === 'test') {
      var server = http.createServer(app);
      server.listen(port);
      server.on('error', onError);
      server.on('listening', onListening);
    } else {
      if (numCPUs > 4) {
        if (process.env.NODE_ENV == undefined || process.env.NODE_ENV == 'dev') {
          numCPUs = 2;
        } else {
          numCPUs = 4;
        }
      }
      if (cluster.isMaster) {
        console.log("Processing master ")

        // Fork workers.
        for (var i = 0; i < numCPUs; i++) {
          cluster.fork();
        }

        Object.keys(cluster.workers).forEach(function (id) {
          console.log("cluster running with ID : " + cluster.workers[id].process.pid);
        });

        cluster.on('exit', function (worker, code, signal) {
          console.log('worker ' + worker.process.pid + ' died');
          cluster.fork();
        });

      } else {
        console.log("Listen on port " + port)
        var server = http.createServer(app);
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
      }
    }
} catch (err) {
  console.log(err);
}
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
}

module.exports = server;
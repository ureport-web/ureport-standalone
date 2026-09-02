#!/usr/bin/env node
if (process.env.NODE_ENV == undefined) {
  process.env.NODE_ENV = "dev";
}

if (process.env.PORT == undefined) {
  var config = require("config");
  process.env.PORT = config.PORT || 3000;
}

var port = normalizePort(process.env.PORT);

console.log("Detected environment ", process.env.NODE_ENV);
console.log("Detected port ", process.env.PORT);

try {
  /**
   * Module dependencies.
   */
  var cluster = require("cluster");
  var numCPUs = require("os").cpus().length;

  var app = require("./app");
  var http = require("http");
  app.set("port", port);

  //setup cache
  app.locals.systemSettingCache = require("cluster-node-cache")(cluster, {
    stdTTL: 86400,
    checkperiod: 3600,
  });

  app.locals.commonCache = require("cluster-node-cache")(cluster, {
    stdTTL: 72000,
    checkperiod: 3600,
  });

  //don't use cluster when it is testing env
  if (process.env.NODE_ENV != undefined && process.env.NODE_ENV === "test") {
    var server = http.createServer(app);
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
  } else {
    if (process.env.UREPORT_IS_DEMO === "true") {
      numCPUs = 1;
    } else if (numCPUs > 4) {
      if (process.env.NODE_ENV == undefined || process.env.NODE_ENV == "dev") {
        numCPUs = 2;
      } else {
        numCPUs = 4;
      }
    }
    if (cluster.isMaster) {
      console.log("Processing master ");

      // Fork workers.
      for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      Object.keys(cluster.workers).forEach(function (id) {
        console.log(
          "cluster running with ID : " + cluster.workers[id].process.pid,
        );
      });

      cluster.on("exit", function (worker, code, signal) {
        console.error(
          "worker " + worker.process.pid + " died" +
          " | exit code: " + code +
          " | signal: " + signal +
          " | suicide: " + worker.exitedAfterDisconnect
        );
        cluster.fork();
      });

      // Broadcast plugin load requests to all other workers
      cluster.on("message", function (sender, msg) {
        if (msg && msg.type === "UREPORT_LOAD_PLUGIN") {
          Object.values(cluster.workers).forEach(function (worker) {
            if (worker.id !== sender.id) worker.send(msg);
          });
        }
      });
    } else {
      var logger = require("./src/utils/logger");

      process.on("unhandledRejection", function (reason) {
        logger.error("Unhandled Rejection:", reason);
      });

      process.on("uncaughtException", function (err) {
        logger.error("Uncaught Exception:", err);
        process.exit(1);
      });

      process.on("SIGTERM", function () {
        logger.error("Worker received SIGTERM — exiting");
        process.exit(0);
      });

      console.log("Listen on port " + port);
      var server = http.createServer(app);
      server.listen(port);
      server.on("error", onError);
      server.on("listening", onListening);
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
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
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
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
}

module.exports = server;

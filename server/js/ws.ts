import express from "express";
import { createServer } from "http";
import * as _ from "lodash";
import path from "path";
import { Server as SocketServer } from "socket.io";

import { random } from "./utils";

const { NODE_ENV } = process.env;

export class Server {
  port;
  _connections = {};
  _counter = 0;
  connection_callback;
  error_callback;
  io: SocketServer | null;
  status_callback;
  server: any;

  constructor(port) {
    this.port = port;
    this.io = null;

    var self = this;

    const app = express();
    const server = createServer(app);
    let cors: any = { origin: "*" };

    if (NODE_ENV === "development") {
      cors = { origin: "*" };
    } else {
      const whitelist = [
        "https://nanobrowserquest.com",
        "https://www.nanobrowserquest.com",
        "https://bananobrowserquest.com",
        "https://www.bananobrowserquest.com",
      ];
      cors = {
        origin: function (origin, callback) {
          if (whitelist.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
      };
    }

    this.io = new SocketServer(server, { cors, allowEIO3: true });

    app.use(express.static(path.join(process.cwd(), "dist/client")));

    this.io.on("connection", function (connection) {
      console.info("~~~~~~~a user connected");

      // connection.remoteAddress = connection.handshake.address;
      const c = new Connection(self._createId(), connection, self);

      self.connection_callback?.(c);

      self.addConnection(c);
    });

    this.io.on("error", function (err) {
      console.error(err.stack);
      self.error_callback();
    });

    console.log(`~~~~~~~~BEFORE BINDING LISTEN on port:${port}`);

    console.info(`Starting NanoBrowserQuest game server... on port ${port}`);

    server
      .listen(port, () => {
        console.log("~~~~5");
        console.info("WS Server is now listening on *:" + port);
      })
      .on("error", err => {
        console.error("Server failed to start", err);
      });
  }

  _createId() {
    return "5" + random(99) + "" + this._counter++;
  }

  broadcast(message) {
    this.forEachConnection(function (connection) {
      connection.send(message);
    });
  }

  onRequestStatus(status_callback) {
    this.status_callback = status_callback;
  }

  onConnect(callback) {
    this.connection_callback = callback;
  }

  onError(callback) {
    this.error_callback = callback;
  }

  forEachConnection(callback) {
    _.each(this._connections, callback);
  }

  addConnection(connection) {
    this._connections[connection.id] = connection;
  }

  removeConnection(id) {
    delete this._connections[id];
  }

  getConnection(id) {
    return this._connections[id];
  }
}

export class Connection {
  _connection;
  _server;
  id;
  listen_callback;
  close_callback;

  constructor(id, connection, server) {
    this._connection = connection;
    this._server = server;
    this.id = id;
    const self = this;

    // HANDLE DISPATCHER IN HERE
    connection.on("dispatch", function (message) {
      console.log("Received dispatch request", message);
      self._connection.emit("dispatched", { status: "OK", host: server.host, port: server.port });
    });

    connection.on("message", function (message) {
      self.listen_callback?.(message);
    });

    connection.on("disconnect", function () {
      self.close_callback?.();
      self._server.removeConnection(self.id);
    });
  }

  onClose(callback) {
    this.close_callback = callback;
  }

  listen(callback) {
    this.listen_callback = callback;
  }

  broadcast(_message) {
    throw "Not implemented";
  }

  send(message) {
    this._connection.emit("message", message);
  }

  sendUTF8(data) {
    this._connection.send(data);
  }

  close(logError) {
    // @TODO undefined here sometimes?
    console.info("Closing connection to " + this._connection.remoteAddress + ". Error: " + logError);
    this._connection.disconnect();
  }
}

export default Server;

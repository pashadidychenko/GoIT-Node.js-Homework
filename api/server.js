const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const userListRouter = require("./routers/userList.routes");

require("dotenv").config();

module.exports = class UserList {
  constructor() {
    this.server = null;
  }
  start() {
    this.initServer();
    this.initMiddlewarew();
    this.initRoutes();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewarew() {
    this.server.use(express.json());
    this.server.use(morgan("combined"));
    this.server.use(cors({ origin: "http://localhost:3000" }));
  }

  initRoutes() {
    this.server.use("/api/contacts", userListRouter);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Start server");
    });
  }
};

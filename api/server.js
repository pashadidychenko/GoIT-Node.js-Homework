const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const userListRouter = require("./routers/userList.routes");

require("dotenv").config();

module.exports = class UserList {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMiddlewarew();
    this.initRoutes();
    await this.initDataBase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewarew() {
    this.server.use(express.json());
    this.server.use(morgan("combined"));
    this.server.use(cors({ origin: `http://localhost:${process.env.PORT}` }));
  }

  initRoutes() {
    this.server.use("/api/contacts", userListRouter);
  }

  async initDataBase() {
    await mongoose.connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Database connection successful");
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Start server");
    });
  }
};

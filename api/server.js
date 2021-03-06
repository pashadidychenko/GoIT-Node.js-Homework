const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const contactsRouter = require("./routers/contacts.routes");
const usersRouter = require("./routers/users.routes");

require("dotenv").config();

module.exports = class StartServer {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMiddlewarew();
    this.initUserRoutes();
    this.initContactsRoutes();
    await this.initDataBase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewarew() {
    this.server.use(express.json());
    this.server.use(morgan("combined"));
    this.server.use(express.static("public"));
    this.server.use(cors({ origin: `http://localhost:${process.env.PORT}` }));
  }

  initContactsRoutes() {
    this.server.use("/api/contacts", contactsRouter);
  }

  initUserRoutes() {
    this.server.use("/api/", usersRouter);
  }

  async initDataBase() {
    await mongoose
      .connect(process.env.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .catch((error) => {
        console.log(error);
        process.exit(1);
      });
    console.log("Database connection successful");
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log("Start server");
    });
  }
};

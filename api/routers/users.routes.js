const { Router } = require("express");
const usersRouter = Router();
const usersControllers = require("../users/users.controllers");

// Registration request
usersRouter.post(
  "/auth/register",
  usersControllers.validateUser,
  usersControllers.registerUser
);

// Login request
usersRouter.post(
  "/auth/login",
  usersControllers.validateUser,
  usersControllers.loginUser
);

// Logout request
usersRouter.post(
  "/auth/logout",
  usersControllers.authorize,
  usersControllers.logoutUser
);

// Current user request
usersRouter.get(
  "/users/current",
  usersControllers.authorize,
  usersControllers.getCurrentUser
);

module.exports = usersRouter;

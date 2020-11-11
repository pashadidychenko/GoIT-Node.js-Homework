const { Router } = require("express");
const usersRouter = Router();
const usersControllers = require("../users/users.controllers");
const { upload } = require("../users/user.helpers");

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

// Add avatar
usersRouter.patch(
  "/users/avatars",
  usersControllers.authorize,
  upload.single("avatars"),
  usersControllers.addAvatar
);

// Update information in user
usersRouter.patch(
  "/users/:id",
  usersControllers.authorize,
  usersControllers.subscriptionType,
  usersControllers.updateCurrentUser
);

// Verification request
usersRouter.get(
  "/auth/verify/:verificationToken",
  usersControllers.verificateEmailUser
);

module.exports = usersRouter;

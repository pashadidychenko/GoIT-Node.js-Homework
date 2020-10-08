const { Router } = require("express");
const userListRouter = Router();
const UserListControllers = require("../controllers/userList.controllers");

// Get User list
userListRouter.get("/", UserListControllers.getUserList);

// Great new User and add to list
userListRouter.post(
  "/",
  UserListControllers.validateCreateUser,
  UserListControllers.creatUser
);

// Update information about User
userListRouter.patch(
  "/:id",
  UserListControllers.checkUserInList,
  UserListControllers.checkDataExist,
  UserListControllers.validateUpdateUser,
  UserListControllers.updateUser
);

// Find User by ID
userListRouter.get(
  "/:id",
  UserListControllers.checkUserInList,
  UserListControllers.getUserById
);

// Delete User by ID
userListRouter.delete(
  "/:id",
  UserListControllers.checkUserInList,
  UserListControllers.deleteUser
);

module.exports = userListRouter;

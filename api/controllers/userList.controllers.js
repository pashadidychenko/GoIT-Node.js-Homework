const Joi = require("joi");
const userModel = require("./userSchema");
const {
  Types: { ObjectId },
} = require("mongoose");

module.exports = class UserListControllers {
  // Get user list
  static async getUserList(req, res, next) {
    try {
      const users = await userModel.find();
      return res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }

  // Get user by id
  static async getUserById(req, res, next) {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Contact not found" });
      }
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  // Great new user
  static async creatUser(req, res, next) {
    try {
      const user = await userModel.create(req.body);
      return res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  // Update user
  static async updateUser(req, res, next) {
    try {
      const user = await userModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "Contact not found" });
      }
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  // Delete User
  static async deleteUser(req, res, next) {
    try {
      const user = await userModel.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Contact alredy deleted" });
      }
      return res.status(200).json({ message: "Contact deleted" });
    } catch (err) {
      next(err);
    }
  }

  // Validate new user
  static validateCreateUser(req, res, next) {
    const createUserRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      subscription: Joi.string().required(),
      password: Joi.string().required(),
      token: Joi.string(),
    });
    const result = createUserRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details);
    }
    next();
  }

  // Validate update user
  static validateUpdateUser(req, res, next) {
    const updateUserRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      subscription: Joi.string(),
      password: Joi.string(),
      token: Joi.string(),
    });
    const result = updateUserRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details);
    }
    next();
  }

  // Check User in list
  static async checkUserInList(req, res, next) {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Not found" });
    }
    next();
  }

  // Check data exist
  static checkDataExist(req, res, next) {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "missing fields" });
    }
    next();
  }
};

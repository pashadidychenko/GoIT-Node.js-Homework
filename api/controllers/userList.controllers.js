const Joi = require("joi");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("./contacts");

module.exports = class UserListControllers {
  // Get user list
  static getUserList(req, res, next) {
    return res.status(200).json(listContacts());
  }

  // Get user by id
  static getUserById(req, res, next) {
    return res.status(200).json(getContactById(req.params.id));
  }

  // Great new user
  static creatUser(req, res, next) {
    addContact(req.body.name, req.body.email, req.body.phone);
    return res.status(201).json(listContacts()[listContacts().length - 1]);
  }

  // Update user
  static updateUser(req, res, next) {
    updateContact(req.params.id, req.body);
    return res.status(200).json(getContactById(req.params.id));
  }

  // deleteUser
  static deleteUser(req, res, next) {
    removeContact(req.params.id);
    return res.status(200).json({ message: "contact deleted" });
  }

  // Validate new user
  static validateCreateUser(req, res, next) {
    const createUserRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
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
    });
    const result = updateUserRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details);
    }
    next();
  }

  // Check User in list
  static checkUserInList(req, res, next) {
    const targetUserIndex = listContacts().findIndex(
      (user) => user.id == req.params.id
    );
    if (targetUserIndex === -1) {
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

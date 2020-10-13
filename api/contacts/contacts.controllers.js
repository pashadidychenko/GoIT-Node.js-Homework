const Joi = require("joi");
const contactModel = require("./contacts.schema");
const {
  Types: { ObjectId },
} = require("mongoose");

module.exports = class contactsControllers {
  // Get contact list
  static async getContactsList(req, res, next) {
    try {
      const contacts = await contactModel.find();
      return res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  }

  // Get contact by id
  static async getContactById(req, res, next) {
    try {
      const contact = await contactModel.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  // Great new contact
  static async creatContact(req, res, next) {
    try {
      const contact = await contactModel.create(req.body);
      return res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  }

  // Update contact by ID
  static async updateContact(req, res, next) {
    try {
      const contact = await contactModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  // Delete contact by ID
  static async deleteContact(req, res, next) {
    try {
      const contact = await contactModel.findByIdAndDelete(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: "Contact alredy deleted" });
      }
      return res.status(200).json({ message: "Contact deleted" });
    } catch (err) {
      next(err);
    }
  }

  // Validate new contact
  static validateCreateContatc(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      subscription: Joi.string().required(),
      password: Joi.string().required(),
      token: Joi.string(),
    });
    const result = createContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details);
    }
    next();
  }

  // Validate update contact
  static validateUpdatecontact(req, res, next) {
    const updateContactRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      subscription: Joi.string(),
      password: Joi.string(),
      token: Joi.string(),
    });
    const result = updateContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details);
    }
    next();
  }

  // Check contact in list
  static async checkContactInList(req, res, next) {
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

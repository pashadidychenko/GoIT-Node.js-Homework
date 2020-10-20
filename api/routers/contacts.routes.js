const { Router } = require("express");
const contactsRouter = Router();
const contactsControllers = require("../contacts/contacts.controllers");

// Get contact list or with options
contactsRouter.get(
  "/",
  contactsControllers.getOptionalContactsList,
  contactsControllers.getContactsList
);

// Great new contact and add to list
contactsRouter.post(
  "/",
  contactsControllers.validateCreateContatc,
  contactsControllers.creatContact
);

// Update information in contact
contactsRouter.patch(
  "/:id",
  contactsControllers.checkContactInList,
  contactsControllers.checkDataExist,
  contactsControllers.validateUpdatecontact,
  contactsControllers.updateContact
);

// Find contact by ID
contactsRouter.get(
  "/:id",
  contactsControllers.checkContactInList,
  contactsControllers.getContactById
);

// Delete contact by ID
contactsRouter.delete(
  "/:id",
  contactsControllers.checkContactInList,
  contactsControllers.deleteContact
);

module.exports = contactsRouter;

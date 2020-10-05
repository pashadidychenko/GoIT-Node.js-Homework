const fs = require("fs");
const path = require("path");
const contactsPath = path.join(__dirname, "../../db/contacts.json");
const shortid = require("shortid");
const { promises: fsPromises } = fs;

// Get contact list
async function listContacts() {
  try {
    return JSON.parse(await fsPromises.readFile(contactsPath, "utf-8"));
  } catch (err) {
    throw err;
  }
}

// Find contact by ID
function getContactById(contactId) {
  return require(contactsPath).find((contact) => contact.id == contactId);
}

// Remove contact by id
async function removeContact(contactId) {
  try {
    const removedContact = require(contactsPath).filter(
      (contact) => contact.id != contactId
    );
    await fsPromises.writeFile(contactsPath, JSON.stringify(removedContact));
  } catch (err) {
    throw err;
  }
}

// Add contact. ID generate atomatycly using "short non-sequential url-friendly unique id generator".
async function addContact(name, email, phone) {
  try {
    const contactList = require(contactsPath);
    const newContactList = [
      ...contactList,
      {
        id: shortid.generate(),
        name: name,
        email: email,
        phone: phone,
      },
    ];
    await fsPromises.writeFile(contactsPath, JSON.stringify(newContactList));
  } catch (err) {
    throw err;
  }
}

// Update contact by id
async function updateContact(contactId, udateData) {
  try {
    const contactList = require(contactsPath);
    const userList = await listContacts();
    const targetUserIndex = userList.findIndex((user) => user.id == contactId);
    contactList[targetUserIndex] = Object.assign(
      contactList[targetUserIndex],
      udateData
    );
    await fsPromises.writeFile(contactsPath, JSON.stringify(contactList));
  } catch (err) {
    throw err;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

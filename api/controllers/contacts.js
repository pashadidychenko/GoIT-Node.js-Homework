const fs = require("fs");
const path = require("path");
const contactsPath = path.join(__dirname, "../../db/contacts.json");
const shortid = require("shortid");

// Get contact list
function listContacts() {
  return JSON.parse(
    fs.readFileSync(contactsPath, "utf-8", (err) => {
      if (err) throw err;
    })
  );
}

// Find contact by ID
function getContactById(contactId) {
  return require(contactsPath).find((contact) => contact.id == contactId);
}

// Remove contact by id
function removeContact(contactId) {
  const removedContact = require(contactsPath).filter(
    (contact) => contact.id != contactId
  );
  fs.writeFileSync(contactsPath, JSON.stringify(removedContact), (err) => {
    if (err) throw err;
  });
}

// Add contact. ID generate atomatycly using "short non-sequential url-friendly unique id generator".
function addContact(name, email, phone) {
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
  fs.writeFileSync(contactsPath, JSON.stringify(newContactList), (err) => {
    if (err) throw err;
  });
}

// Update contact by id
function updateContact(contactId, udateData) {
  const contactList = require(contactsPath);
  const targetUserIndex = listContacts().findIndex(
    (user) => user.id == contactId
  );
  contactList[targetUserIndex] = Object.assign(
    contactList[targetUserIndex],
    udateData
  );
  fs.writeFileSync(contactsPath, JSON.stringify(contactList), (err) => {
    if (err) throw err;
  });
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

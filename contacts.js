const fs = require("fs");
const path = require("path");
const contactsPath = path.join(__dirname, "./db/contacts.json");
const shortid = require("shortid");

// Get contact list
function listContacts() {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;
    console.log(data);
  });
}

// Find contact by ID
function getContactById(contactId) {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;
    const contact = JSON.parse(data).find(
      (contact) => contact.id === contactId
    );
    console.log(contact);
  });
}

// Remove contact by id
function removeContact(contactId) {
  fs.readFile(contactsPath, "utf8", (err, data) => {
    if (err) throw err;
    const filteredContacts = JSON.parse(data).filter(
      (contact) => contact.id !== contactId
    );
    fs.writeFile(contactsPath, JSON.stringify(filteredContacts), (err) => {
      if (err) throw err;
    });
  });
}

// Add contact. ID generate atomatycly using "short non-sequential url-friendly unique id generator".
function addContact(name, email, phone) {
  const oldContactList = require(contactsPath);
  const newContactList = [
    ...oldContactList,
    {
      id: shortid.generate(),
      name: name,
      email: email,
      phone: phone,
    },
  ];
  fs.writeFile(contactsPath, JSON.stringify(newContactList), (err) => {
    if (err) throw err;
  });
}

module.exports = { listContacts, getContactById, removeContact, addContact };

const bcrypt = require("bcrypt");
const saltRounds = 1;
const userModel = require("./users.schema");

async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

async function findUser(email) {
  return await userModel.findOne({ email });
}

async function updateToken(id, newToken) {
  return await userModel.findByIdAndUpdate(id, { token: newToken });
}

module.exports = {
  hashPassword,
  findUser,
  updateToken,
};

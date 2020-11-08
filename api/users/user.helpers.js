const bcrypt = require("bcrypt");
const saltRounds = 8;
const userModel = require("./users.schema");
const fs = require("fs");
const Avatar = require("avatar-builder");

// Multer
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp");
  },
  filename: function (req, file, cb) {
    let ext = "";
    if (file.originalname.split(".").length > 1)
      ext = file.originalname.substring(
        file.originalname.lastIndexOf("."),
        file.originalname.length
      );
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

// image minimaiz
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

async function imageMinify() {
  const files = await imagemin(["tmp/*.{jpg,png}"], {
    destination: "public/images",
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });
}

async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}

async function findUser(email) {
  return await userModel.findOne({ email });
}

async function updateToken(id, newToken) {
  return await userModel.findByIdAndUpdate(id, { token: newToken });
}

// Great avatar
const catAvatar = Avatar.catBuilder(256);
async function greatAvatar(name) {
  return await catAvatar.create(name).then((buffer) =>
    fs.writeFile(`tmp/${name}.png`, buffer, (err) => {
      if (err) throw err;
    })
  );
}

// Remove avatar
async function removeAvatar(file) {
  return await fs.unlink(`tmp/${file}`, (err) => {
    if (err) throw err;
  });
}

module.exports = {
  hashPassword,
  findUser,
  updateToken,
  greatAvatar,
  removeAvatar,
  imageMinify,
  upload,
};

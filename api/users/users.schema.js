const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },
    password: { type: String, required: true },
    avatarURL: { type: String },
    token: { type: String },
    verificationToken: { type: String },
  },
  { versionKey: false }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

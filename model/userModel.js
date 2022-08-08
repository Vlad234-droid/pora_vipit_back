const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 15,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 30,
  },
  token: {
    type: String,
    required: false,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    max: 20,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Users", userSchema);

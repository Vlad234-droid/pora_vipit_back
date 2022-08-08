const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const userNameCheck = await User.findOne({ username });
    if (userNameCheck) {
      return res.json({ message: "Username already used", status: false });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ message: "Email already used", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      username,
      password: hashedPassword,
    });

    return res.json({ status: true });
  } catch (error) {
    next(error);
  }
};

const generateAccessToken = (user) => {
  const payload = {
    user,
  };
  //@ts-ignore
  return jwt.sign(payload, process.env.MONGO_SECRET_KEY, { expiresIn: "6h" });
};

module.exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.json({
      message: "Incorrect username or password",
      status: false,
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.json({
      message: "Incorrect username or password",
      status: false,
    });
  }

  const token = generateAccessToken({ username: user.username, id: user._id });

  await User.updateOne(
    { username },
    {
      token,
    }
  );
  await user.save();
  return res.json({ status: true, token, user });
};

module.exports.avatar = async (req, res, next) => {
  try {
    const id = req.params.id;
    const avatarImage = req.body.image;
    await User.findByIdAndUpdate(id, {
      isAvatarImageSet: true,
      avatarImage,
    });

    return res.json({
      isSet: true,
      image: avatarImage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports.user = async (req, res, next) => {
  try {
    const id = req.user.user.id;

    const user = await User.findOne({ _id: id });

    return res.json(user);
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

const {
  register,
  login,
  avatar,
  getAllUsers,
  user,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/avatar/:id", avatar);
router.get("/user", authMiddleware, user);
router.get("/all-users/:id", getAllUsers);

module.exports = router;

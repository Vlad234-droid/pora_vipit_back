const {
  addMessage,
  getAllMessage,
} = require("../controllers/messagesController");

const router = require("express").Router();

router.post("/messages/add", addMessage);
router.post("/messages", getAllMessage);

module.exports = router;

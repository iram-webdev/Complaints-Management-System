const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const {
    chatPage,
    sendMessage
} = require("../controllers/messageController");

// chat page
router.get("/", auth, chatPage);

// send message
router.post("/send", auth, sendMessage);

module.exports = router;
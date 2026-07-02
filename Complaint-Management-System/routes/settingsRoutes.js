const express = require("express");
const router = express.Router();

const settingsController = require("../controllers/settingsController");
const isLoggedIn = require("../middleware/authMiddleware");

// SETTINGS PAGE
router.get("/", isLoggedIn, settingsController.getSettings);

// UPDATE PROFILE
router.post("/profile", isLoggedIn, settingsController.updateProfile);

// CHANGE PASSWORD
router.post("/password", isLoggedIn, settingsController.changePassword);

module.exports = router;
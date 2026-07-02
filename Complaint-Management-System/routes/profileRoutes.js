const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");
const isLoggedIn = require("../middleware/authMiddleware");

// PROFILE PAGE
router.get("/", isLoggedIn, profileController.getProfile);

// UPDATE PROFILE
router.post("/update", isLoggedIn, profileController.updateProfile);

// CHANGE PASSWORD
router.post("/password", isLoggedIn, profileController.changePassword);

module.exports = router;
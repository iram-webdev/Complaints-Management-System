const express = require("express");
const router = express.Router();

const { getReports } = require("../controllers/reportController");
const isLoggedIn = require("../middleware/authMiddleware");

router.get("/", isLoggedIn, getReports);

module.exports = router;
const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const userController = require("../controllers/userController");

router.get("/users", admin, userController.getUsers);

router.get("/users/add", admin, userController.addPage);

router.post("/users/add", admin, userController.addUser);

router.get("/users/edit/:id", admin, userController.editPage);

router.post("/users/edit/:id", admin, userController.updateUser);

router.get("/users/delete/:id", admin, userController.deleteUser);

module.exports = router;
const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const complaintController = require("../controllers/complaintController");

router.get("/complaints", auth, complaintController.getComplaints);

router.get("/complaints/add", auth, complaintController.showAddForm);

router.post("/complaints/add", auth, complaintController.addComplaint);

router.get("/complaints/edit/:id", auth, complaintController.editPage);

router.post("/complaints/edit/:id", auth, complaintController.updateComplaint);

router.get("/complaints/delete/:id", auth, complaintController.deleteComplaint);

module.exports = router;
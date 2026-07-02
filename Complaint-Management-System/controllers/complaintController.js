const Complaint = require("../models/Complaint");

// ADD FORM
exports.showAddForm = (req, res) => {
    res.render("complaints/add", {
        layout: "layouts/main",
        title: "Add Complaint"
    });
};

// CREATE COMPLAINT (FIXED)
exports.addComplaint = async (req, res) => {
    try {
        const { title, description, category } = req.body;

        await Complaint.create({
            title,
            description,
            category,
            user: req.user.id   // ✅ IMPORTANT FIX
        });

        res.redirect("/complaints");

    } catch (err) {
        console.log(err);
        res.send("Error creating complaint");
    }
};

// GET ALL COMPLAINTS (FIXED + POPULATE)
exports.getComplaints = async (req, res) => {
    try {

        const complaints = await Complaint.find()
            .populate("user", "name email")   // ✅ FIXED
            .sort({ createdAt: -1 });         // optional but good

        res.render("complaints/index", {
            layout: "layouts/main",
            title: "Complaints",
            complaints
        });

    } catch (err) {
        console.log(err);
        res.send("Error loading complaints");
    }
};

// EDIT PAGE
exports.editPage = async (req, res) => {
    try {

        const complaint = await Complaint.findById(req.params.id);

        res.render("complaints/edit", {
            layout: "layouts/main",
            title: "Edit Complaint",
            complaint
        });

    } catch (err) {
        console.log(err);
        res.send("Error");
    }
};

// UPDATE
exports.updateComplaint = async (req, res) => {
    try {

        const { title, description, category, status } = req.body;

        await Complaint.findByIdAndUpdate(req.params.id, {
            title,
            description,
            category,
            status
        });

        res.redirect("/complaints");

    } catch (err) {
        console.log(err);
        res.send("Update Error");
    }
};

// DELETE
exports.deleteComplaint = async (req, res) => {
    try {

        await Complaint.findByIdAndDelete(req.params.id);

        res.redirect("/complaints");

    } catch (err) {
        console.log(err);
        res.send("Delete Error");
    }
};
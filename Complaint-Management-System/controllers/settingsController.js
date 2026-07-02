const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET SETTINGS PAGE
exports.getSettings = async (req, res) => {
    try {

        const user = await User.findById(req.user.id).lean();

        res.render("settings/index", {
            title: "Settings",
            user
        });

    } catch (err) {
        console.log(err);
        res.send("Error loading settings");
    }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {

        const { name, email } = req.body;

        await User.findByIdAndUpdate(req.user.id, {
            name,
            email
        });

        res.redirect("/settings");

    } catch (err) {
        console.log(err);
        res.send("Profile update error");
    }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
    try {

        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.send("Old password is incorrect");
        }

        const hashed = await bcrypt.hash(newPassword, 10);

        user.password = hashed;
        await user.save();

        res.redirect("/settings");

    } catch (err) {
        console.log(err);
        res.send("Password change error");
    }
};
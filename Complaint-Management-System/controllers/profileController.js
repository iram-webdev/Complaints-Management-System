const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET PROFILE
exports.getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id).lean();

        if (!user) {
            return res.redirect("/login");
        }

        res.render("profile/index", {
            title: "Profile",
            user
        });

    } catch (err) {
        console.log(err);
        res.send("Error loading profile");
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

        res.redirect("/profile");

    } catch (err) {
        console.log(err);
        res.send("Update error");
    }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
    try {

        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) return res.redirect("/login");

        const match = await bcrypt.compare(oldPassword, user.password);

        if (!match) return res.send("Old password incorrect");

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.redirect("/profile");

    } catch (err) {
        console.log(err);
        res.send("Password error");
    }
};
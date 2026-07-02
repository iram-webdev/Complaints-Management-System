const User = require("../models/User");
const bcrypt = require("bcryptjs");

// All Users
exports.getUsers = async (req, res) => {

    const users = await User.find();

    res.render("users/index", {
        title: "Users",
        users
    });

};

// Add User Page
exports.addPage = (req, res) => {

    res.render("users/add", {
        title: "Add User"
    });

};

// Save User
exports.addUser = async (req, res) => {

    const { name, email, password, role } = req.body;

    const hash = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password: hash,
        role
    });

    res.redirect("/users");

};

// Edit User Page
exports.editPage = async (req, res) => {

    const user = await User.findById(req.params.id);

    res.render("users/edit", {
        title: "Edit User",
        user
    });

};

// Update User
exports.updateUser = async (req, res) => {

    const { name, email, role } = req.body;

    await User.findByIdAndUpdate(req.params.id, {
        name,
        email,
        role
    });

    res.redirect("/users");

};

// Delete User
exports.deleteUser = async (req, res) => {

    await User.findByIdAndDelete(req.params.id);

    res.redirect("/users");

};
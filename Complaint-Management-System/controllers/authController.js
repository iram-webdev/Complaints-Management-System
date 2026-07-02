const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.send("Invalid Email");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send("Invalid Password");
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true
        });

        res.redirect("/dashboard");

    } catch (err) {
        console.log(err);
        res.send("Login Failed");
    }
};

exports.register = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const { name, email, password } = req.body;

        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.send("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        const savedUser = await user.save();

        console.log("Saved User:", savedUser);

        res.redirect("/login");

    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};
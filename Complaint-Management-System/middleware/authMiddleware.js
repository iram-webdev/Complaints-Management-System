const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect("/login");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ FIX: keep consistent naming
        req.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role
        };

        res.locals.user = req.user;

        next();

    } catch (err) {
        res.clearCookie("token");
        return res.redirect("/login");
    }
};
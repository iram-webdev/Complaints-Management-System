const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).render("403", {
                title: "Access Denied"
            });
        }

        req.user = decoded;

        next();

    } catch (err) {

        return res.redirect("/login");

    }

};
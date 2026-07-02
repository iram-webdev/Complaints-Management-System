const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

// Load env
dotenv.config();

// Routes
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ======================
// SOCKET.IO
// ======================
app.set("io", io); // ✅ FIX: global access

io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("send_message", (data) => {
        io.emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
    });
});

// ======================
// MIDDLEWARE
// ======================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// JWT USER GLOBAL FIX
app.use((req, res, next) => {
    try {
        const token = req.cookies.token;

        if (token) {
            req.user = jwt.verify(token, process.env.JWT_SECRET);
        } else {
            req.user = null;
        }
    } catch (err) {
        req.user = null;
        res.clearCookie("token");
    }

    res.locals.user = req.user;
    next();
});

// STATIC
app.use(express.static(path.join(__dirname, "public")));

// ======================
// EJS SETUP
// ======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/main");
app.use(expressLayouts);

// ======================
// DATABASE
// ======================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Error:", err));

// ======================
// ROUTES
// ======================
app.get("/", (req, res) => res.redirect("/login"));

app.get("/login", (req, res) => {
    res.render("auth/login", { title: "Login" });
});

app.get("/register", (req, res) => {
    res.render("auth/register", { title: "Register" });
});

app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", complaintRoutes);
app.use("/", userRoutes);

// 👉 ADD THIS LINE (IMPORTANT)
app.use("/message", require("./routes/messageRoutes"));

app.use("/reports", require("./routes/reportRoutes"));
app.use("/settings", require("./routes/settingsRoutes"));
app.use("/profile", require("./routes/profileRoutes"));

// ======================
// LOGOUT
// ======================
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

// ======================
// 404 PAGE
// ======================
app.use((req, res) => {
    res.status(404).render("404", { title: "404 - Page Not Found" });
});

// ======================
// SERVER START
// ======================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server Running on http://localhost:${PORT}`);
});
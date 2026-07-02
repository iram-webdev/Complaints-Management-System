const Message = require("../models/Message");

// CHAT PAGE
exports.chatPage = async (req, res) => {
    try {

        const messages = await Message.find()
            .populate("sender", "name role")
            .sort({ createdAt: 1 });

        res.render("message/index", {
            title: "Messages",
            messages: messages || [],
            user: req.user || {}   // ✅ FIX: never null
        });

    } catch (err) {
        console.log(err);
        res.status(500).send("Chat page error");
    }
};


// SEND MESSAGE
exports.sendMessage = async (req, res) => {
    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const msg = await Message.create({
            message: req.body.message,
            sender: req.user.id   // ✅ FIX
        });

        const fullMsg = await msg.populate("sender", "name role");

        req.app.get("io").emit("receive_message", fullMsg);

        res.json(fullMsg);

    } catch (err) {
        console.log(err);
        res.status(500).send("Error sending message");
    }
};
const User = require("../models/User");
const Complaint = require("../models/Complaint");

exports.dashboard = async (req, res) => {
    try {

        const [
            totalUsers,
            totalComplaints,
            pending,
            inProgress,
            resolved,
            rejected,
            complaints
        ] = await Promise.all([
            User.countDocuments(),
            Complaint.countDocuments(),
            Complaint.countDocuments({ status: "Pending" }),
            Complaint.countDocuments({ status: "In Progress" }),
            Complaint.countDocuments({ status: "Resolved" }),
            Complaint.countDocuments({ status: "Rejected" }),

            Complaint.find()
                .populate("user", "name email")
                .sort({ createdAt: -1 })
                .limit(5)
                .lean()
        ]);

        res.render("dashboard/index", {
            title: "Dashboard",
            totalUsers,
            totalComplaints,
            pending,
            inProgress,
            resolved,
            rejected,
            complaints
        });

    } catch (err) {
        console.log(err);
        res.send("Dashboard Error");
    }
};
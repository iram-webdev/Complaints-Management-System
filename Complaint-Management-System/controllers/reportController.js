const Complaint = require("../models/Complaint");
const User = require("../models/User");

exports.getReports = async (req, res) => {
    try {

        const [
            totalUsers,
            totalComplaints,
            pending,
            inProgress,
            resolved,
            rejected,
            recentComplaints
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
                .limit(10)
        ]);

        res.render("reports/index", {
            title: "Reports",
            totalUsers,
            totalComplaints,
            pending,
            inProgress,
            resolved,
            rejected,
            recentComplaints
        });

    } catch (err) {
        console.log(err);
        res.send("Reports Error");
    }
};
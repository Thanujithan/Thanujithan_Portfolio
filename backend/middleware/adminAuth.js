const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminAuth = async (req, res, next) => {
    try {
        const authorization =
            req.headers.authorization;

        if (
            !authorization ||
            !authorization.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message:
                    "Authorization token required"
            });
        }

        const token =
            authorization.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const admin = await Admin.findById(
            decoded.id
        ).select("-password");

        if (!admin) {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        req.admin = admin;

        next();

    } catch (error) {
        console.error(
            "Admin authentication error:",
            error.message
        );

        return res.status(401).json({
            message:
                "Invalid or expired admin token"
        });
    }
};

module.exports = adminAuth;
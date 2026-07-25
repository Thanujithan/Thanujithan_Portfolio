const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// ===================================
// VERIFY ADMIN TOKEN
// ===================================
const protect = async (req, res, next) => {
    try {
        let token;

        const authorization =
            req.headers.authorization;

        if (
            authorization &&
            authorization.startsWith("Bearer ")
        ) {
            token = authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "Authorization token required."
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const adminId =
            decoded.adminId ||
            decoded.id ||
            decoded._id;

        if (!adminId) {
            return res.status(401).json({
                message: "Invalid token."
            });
        }

        const admin = await Admin.findById(
            adminId
        ).select("-password");

        if (!admin) {
            return res.status(401).json({
                message: "Admin account not found."
            });
        }

        req.admin = admin;

        next();

    } catch (error) {
        console.error(
            "Authentication error:",
            error.message
        );

        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

// ===================================
// ADMIN ACCESS
// ===================================
const adminOnly = (req, res, next) => {
    if (!req.admin) {
        return res.status(403).json({
            message: "Admin access required."
        });
    }

    next();
};

module.exports = {
    protect,
    adminOnly
};
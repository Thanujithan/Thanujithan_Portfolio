const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Generate JWT token
const generateToken = (admin) => {
    return jwt.sign(
        {
            id: admin._id,
            username: admin.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

// Admin login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const passwordMatch = await admin.comparePassword(password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const token = generateToken(admin);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                username: admin.username
            }
        });
    } catch (error) {
        console.error("Admin login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// Check token
router.get("/verify", adminAuth, async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Token is valid",
        admin: req.admin
    });
});

module.exports = router;
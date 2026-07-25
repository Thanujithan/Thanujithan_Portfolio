const express = require("express");
const Contact = require("../models/Contact");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Public route - save contact message
router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const contact = await Contact.create({
            name,
            email,
            subject,
            message
        });

        res.status(201).json({
            success: true,
            message: "Message saved successfully",
            data: contact
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// Protected route - get messages
router.get("/", adminAuth, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// Update contact message status
router.patch("/:id/status", adminAuth, async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = ["new", "read", "replied"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid message status"
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Message status updated successfully",
            data: contact
        });

    } catch (error) {
        console.error("Update status error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update message status"
        });
    }
});

// Protected route - delete message
router.delete("/:id", adminAuth, async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        await Contact.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });
    } catch (error) {
        console.error("Delete message error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = router;
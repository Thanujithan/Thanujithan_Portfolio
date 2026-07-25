const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const adminAuth = require("../middleware/adminAuth");

// ===============================
// GET ALL PROJECTS - Public
// ===============================
router.get("/", async (req, res) => {
    try {
        const projects = await Project.find().sort({
            displayOrder: 1,
            createdAt: -1
        });

        res.status(200).json(projects);

    } catch (error) {
        console.error(
            "Fetch projects error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch projects"
        });
    }
});

// ===============================
// GET SINGLE PROJECT - Public
// ===============================
router.get("/", async (req, res) => {
    try {
        const projects = await Project.find()
            .sort({
                featured: -1,
                displayOrder: 1,
                createdAt: -1
            });

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({
            message: "Failed to load projects"
        });
    }
});


// ===============================
// CREATE PROJECT - Admin
// ===============================
router.post("/", adminAuth, async (req, res) => {
    try {
        const {
            title,
            description,
            technologies,
            imageUrl,
            githubUrl,
            liveUrl,
            featured,
            displayOrder
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message:
                    "Title and description are required"
            });
        }

        const project = await Project.create({
            title,
            description,
            technologies:
                Array.isArray(technologies)
                    ? technologies
                    : [],
            imageUrl: imageUrl || "",
            githubUrl: githubUrl || "",
            liveUrl: liveUrl || "",
            featured: Boolean(featured),
            displayOrder:
                Number(displayOrder) || 0
        });

        res.status(201).json({
            message:
                "Project created successfully",
            project
        });

    } catch (error) {
        console.error(
            "Create project error:",
            error
        );

        res.status(500).json({
            message: "Failed to create project"
        });
    }
});

// ===============================
// UPDATE PROJECT - Admin
// ===============================
router.put("/:id", adminAuth, async (req, res) => {
    try {
        const project =
            await Project.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            message:
                "Project updated successfully",
            project
        });

    } catch (error) {
        console.error(
            "Update project error:",
            error
        );

        res.status(500).json({
            message: "Failed to update project"
        });
    }
});

// ===============================
// DELETE PROJECT - Admin
// ===============================
router.delete(
    "/:id",
    adminAuth,
    async (req, res) => {
        try {
            const project =
                await Project.findByIdAndDelete(
                    req.params.id
                );

            if (!project) {
                return res.status(404).json({
                    message: "Project not found"
                });
            }

            res.status(200).json({
                message:
                    "Project deleted successfully"
            });

        } catch (error) {
            console.error(
                "Delete project error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to delete project"
            });
        }
    }
);

module.exports = router;
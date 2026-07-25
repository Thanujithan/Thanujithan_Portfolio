const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        technologies: {
            type: [String],
            default: []
        },

        imageUrl: {
            type: String,
            default: ""
        },

        githubUrl: {
            type: String,
            default: ""
        },

        liveUrl: {
            type: String,
            default: ""
        },

        featured: {
            type: Boolean,
            default: false
        },

        displayOrder: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Project", projectSchema);
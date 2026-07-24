const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await Admin.findOne({
            username: process.env.ADMIN_USERNAME
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        await Admin.create({
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD
        });

        console.log("Admin created successfully");
        process.exit(0);
    } catch (error) {
        console.error("Create admin error:", error.message);
        process.exit(1);
    }
};

createAdmin();
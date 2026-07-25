const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files, including images folder
app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);

// API routes
app.use(
    "/api/contact",
    require("./routes/contactRoutes")
);

app.use(
    "/api/admin",
    require("./routes/adminRoutes")
);

app.use(
    "/api/projects",
    projectRoutes
);

// Backend test route
app.get("/api", (req, res) => {
    res.send("Portfolio Backend Running...");
});

// Open frontend home page
app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(
                `Server running at http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Server start failed:",
            error.message
        );

        process.exit(1);
    }
};

startServer();
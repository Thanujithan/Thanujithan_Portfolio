const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
    res.send("Portfolio Backend Running...");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server start failed:", error.message);
    }
};

startServer();
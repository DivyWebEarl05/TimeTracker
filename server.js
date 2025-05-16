import express from "express";
import cors from "cors";
import connectDB from "./src/Config/db.js";
import dotenv from "dotenv";

// Profile
import ProfileRoutes from "./src/Routes/profile.Routes.js";

// Admin
import AdminRoutes from "./src/Routes/admin.Routes.js";

// Attendance
import AttendanceRoutes from "./src/Routes/attendance.Routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
// app.use('/plan', express.static('uploads/plans'));
app.use(express.urlencoded({ extended: true }));

app.use("/api/profile", ProfileRoutes)
app.use("/api/admin", AdminRoutes)
app.use("/api/attendance", AttendanceRoutes)

// IN case Fail Config db.js
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log("SERVER RUNNING ON PORT:", process.env.PORT);
        });
    })
    .catch((err) => {
        console.log("MONGODB CONNECTION FAILED: ", err);
    });
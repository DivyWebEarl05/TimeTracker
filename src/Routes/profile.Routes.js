import express from "express";
import {
    sendOtp,
    verifyOtp,
    completeProfile,
    login
} from "../Controller/profile.Controller.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/complete-profile", completeProfile);
router.post("/login", login);

export default router;
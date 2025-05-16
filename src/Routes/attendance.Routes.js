import express from 'express';
import { 
    createAttendance,
    getAllAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    getByDate
} from '../Controller/attendance.Controller.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post("/create", protect, createAttendance);
router.get("/getAllAttendance", protect, getAllAttendance);
router.get("/getAttendanceById/:id", protect, getAttendanceById);
router.put("/updateAttendance/:id", protect, updateAttendance);
router.delete("/deleteAttendance/:id", protect, deleteAttendance);
router.post("/getByDate", protect, getByDate);

export default router;
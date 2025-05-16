import Attendance from "../Model/attendanceModel.js";
import mongoose from "mongoose";

const createAttendance = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { date, in_time, out_time, break_time } = req.body;
    const attendance = await Attendance.create({
      user: userId,
      date,
      in_time,
      out_time,
      break_time,
    });
    res.status(201).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while creating attendance" });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const userId = req.user._id;
    const attendance = await Attendance.find({ user: userId }).populate("user");
    res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching attendance" });
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid attendance ID" });
    }
    const attendance = await Attendance.findOne({
      _id: id,
      user: userId,
    }).populate("user");
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching attendance" });
  }
};

const getByDate = async (req, res) => {
    try {
        const userId = req.user._id;
        const { date } = req.body;
        if (!date) {
            return res.status(400).json({ message: "Date is required" });
        }
        const attendance = await Attendance.findOne({ user: userId, date }).populate("user");
        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found for this date" });
        }
        res.status(200).json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching attendance" });
    }
}

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { date, in_time, out_time, break_time } = req.body;
    const attendance = await Attendance.findOneAndUpdate(
      { _id: id, user: userId },
      { date, in_time, out_time, break_time },
      { new: true }
    );
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating attendance" });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const attendance = await Attendance.findOneAndDelete({
      _id: id,
      user: userId,
    });
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting attendance" });
  }
};

export {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getByDate
};
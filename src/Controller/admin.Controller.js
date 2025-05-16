import AppAdmin from "../Model/adminModel.js";
import jwt from "jsonwebtoken";
import User from "../Model/profileModel.js";
import mongoose from "mongoose";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ADMIN_SECRET, {
    expiresIn: "1d",
  });
};

// const appAdminSignUp = async (req, res) => {
//     const { email, phoneNumber, password } = req.body;

//     const phoneRegex = /^[6-9]\d{9}$/; // Typical Indian mobile number pattern
//     if (!phoneRegex.test(phoneNumber)) {
//         return res.status(400).json({ message: 'Invalid phone number format' });
//     }

//     try {
//         const adminExists = await AppAdmin.findOne({ $or: [{ email }, { phoneNumber }] });

//         if (adminExists) {
//             return res.status(400).json({ message: 'AppAdmin already exists with this email/phone number' });
//         }

//         const admin = await AppAdmin.create({
//             email,
//             phoneNumber,
//             password, // plain text
//         });

//         res.status(201).json({
//             _id: admin._id,
//             email: admin.email,
//             phoneNumber: admin.phoneNumber,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error registering user' });
//     }
// };

// SIGN IN
const appAdminSignIn = async (req, res) => {
  const { email, phoneNumber, password } = req.body;

  try {
    const user = await AppAdmin.findOne({ $or: [{ email }, { phoneNumber }] });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email/phone number or password" });
    }

    if (password !== user.password) {
      return res
        .status(401)
        .json({ message: "Invalid email/phone number or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};

// PROFILE
const getappAdminProfile = async (req, res) => {
  try {
    const user = await AppAdmin.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      _id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching Admin profile" });
  }
};

// UPDATE PROFILE
const updateappAdminProfile = async (req, res) => {
  const { email, phoneNumber } = req.body;

  try {
    const user = await AppAdmin.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (phoneNumber) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number format" });
      }
      user.phoneNumber = phoneNumber;
    }

    user.email = email || user.email;

    await user.save();

    res.status(200).json({
      _id: user._id,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

const appAdminchangePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await AppAdmin.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (oldPassword !== user.password) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $project: {
          _id: 1,
          mobile_number: 1,
          full_name: 1,
          email: 1,
          state: 1,
          city: 1,
          work_place_name: 1,
          position: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $lookup: {
          from: "attendances", 
          localField: "_id",
          foreignField: "user",
          as: "attendance",
        },
      },
    ]);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const users = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $project: {
          _id: 1,
          mobile_number: 1,
          full_name: 1,
          email: 1,
          state: 1,
          city: 1,
          work_place_name: 1,
          position: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $lookup: {
          from: "attendances", 
          localField: "_id",
          foreignField: "user",
          as: "attendance",
        },
      },
    ]);
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

export {
  // appAdminSignUp,
  appAdminSignIn,
  getappAdminProfile,
  updateappAdminProfile,
  appAdminchangePassword,
  getAllUsers,
  getUserById,
};

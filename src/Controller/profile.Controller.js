import User from "../Model/profileModel.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "divy";

const sendOtp = async (req, res) => {
  try {
    const { mobile_number } = req.body;

    let user = await User.findOne({ mobile_number });

    const otp = Math.floor(100000 + Math.random() * 900000);

    if (!user) {
      user = await User.create({ mobile_number, otp });
    } else {
      user.otp = otp;
      await user.save();
    }

    // console.log(`Sending OTP ${otp} to ${mobile_number}`);

    res.status(200).json({ message: "OTP sent successfully", otp }); // Send OTP in response
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
const verifyOtp = async (req, res) => {
  try {
    const { mobile_number, otp } = req.body;
    const user = await User.findOne({ mobile_number });

    if (!user || user.otp !== Number(otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const user_exists = !!(
      user.full_name &&
      user.email &&
      user.state &&
      user.city &&
      user.work_place_name &&
      user.position
    );

    if (user_exists) {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      return res.status(200).json({
        message: "OTP verified",
        user_exists: true,
        token,
      });
    } else {
      return res.status(200).json({
        message: "OTP verified",
        user_exists: false,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const completeProfile = async (req, res) => {
  try {
    const {
      mobile_number,
      full_name,
      email,
      state,
      city,
      work_place_name,
      position,
    } = req.body;

    const user = await User.findOne({ mobile_number });

    if (!user) return res.status(404).json({ error: "User not found" });

    user.full_name = full_name;
    user.email = email;
    user.state = state;
    user.city = city;
    user.work_place_name = work_place_name;
    user.position = position;
    user.status = "active";

    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Profile completed",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { mobile_number } = req.body;
    const user = await User.findOne({ mobile_number });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      user.full_name &&
      user.email &&
      user.state &&
      user.city &&
      user.work_place_name &&
      user.position
    ) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      user.otp = otp;
      await user.save();

      // console.log(`Resending OTP ${otp} to ${mobile_number}`);

      res.status(200).json({
        message: "OTP resent. Please verify to log in.",
        otp 
      });
    } else {
      res.status(200).json({
        message: "Complete profile required",
        user_exists: false,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export { sendOtp, verifyOtp, completeProfile, login };
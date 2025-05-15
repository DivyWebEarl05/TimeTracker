import mongoose from "mongoose";

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000;
    const now = new Date();
    return new Date(now.getTime() + istOffset);
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

const userSchema = new mongoose.Schema({
    mobile_number: {
        type: Number,
        required: true,
        unique: true
    },
    otp: {
        type: Number,
        default: generateOTP
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    full_name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    work_place_name: {
        type: String
    },
    position: {
        type: String
    }
}, {
    timestamps: {
        currentTime: () => getISTTime()
    }
});

const User = mongoose.model("User", userSchema);
export default User;
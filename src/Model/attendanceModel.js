import mongoose from "mongoose";

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000;
    const now = new Date();
    return new Date(now.getTime() + istOffset);
}

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    in_time: {
      type: String,
      required: true,
    },

    out_time: {
      type: String,
      required: true,
    },

    break_time: {
      type: String,
      required: true,
    },

}, {
    timestamps: {
        currentTime: () => getISTTime()
    }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
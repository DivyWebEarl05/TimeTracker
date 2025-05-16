import jwt from "jsonwebtoken";
import AppAdmin from "../Model/adminModel.js"

const AppAdminprotect = async (req, res, next) => {
    try {
        // console.log("Headers:", req.headers); // Debugging log
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1]; 
        }

        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

        req.user = await AppAdmin.findById(decoded.id).select("-password");
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, invalid token" });
    }
};

export {
    AppAdminprotect
}
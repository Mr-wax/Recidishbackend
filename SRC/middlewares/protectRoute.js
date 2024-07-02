import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const protectRoute = async (req, res, next) => {
  try {
    if (!jwt) {
      throw new Error("jsonwebtoken module is not defined.");
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not defined.");
    }

    console.log("Token received:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      throw new Error("User not found.");
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error("Error in protectRoute:", err);
  }
};

export default protectRoute;

import { Request, Response } from "express";
import User from "../models/User"; // Assuming you have a User model
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // req.userId comes from the authMiddleware
    const user = await User.findById(req.userId).select("-password"); // Don't send password
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};
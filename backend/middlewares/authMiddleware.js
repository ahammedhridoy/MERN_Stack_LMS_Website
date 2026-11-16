import { clerkClient } from "@clerk/express";

export const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Please log in" });
    }

    const response = await clerkClient.users.getUser(userId);

    if (response?.publicMetadata?.role !== "educator") {
      return res.status(403).json({ success: false, message: "Forbidden: Educator access required" });
    }

    next();
  } catch (error) {
    console.error("Educator auth error:", error);
    res.status(500).json({ success: false, message: "Internal authorization error" });
  }
};

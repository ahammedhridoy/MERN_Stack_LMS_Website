import User from "../models/User";

export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    req.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

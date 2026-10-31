import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authenticateUser = async (req, res, next) => {
  const cookieName = process.env.COOKIE_NAME || "campusfix_token";
  const token = req.cookies?.[cookieName];

  console.log("AUTH CHECK:", {
    path: req.originalUrl,
    hasCookie: Boolean(token)
  });

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You must log in to continue"
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.userId).select(
      "name email role"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account was not found"
      });
    }

    req.user = user;

    console.log("AUTH USER:", {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    });

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Your login session is invalid or expired"
    });
  }
};

export default authenticateUser;

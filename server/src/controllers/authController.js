import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const publicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role
});

const createToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString()
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );
};

const setAuthCookie = (res, token) => {
  const cookieName = process.env.COOKIE_NAME || "campusfix_token";

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000
  });
};

export const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "student"
    });

    const token = createToken(user);
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Student account created successfully",
      token,
      user: publicUser(user)
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "The account could not be created"
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = createToken(user);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: publicUser(user)
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};

export const logout = (req, res) => {
  const cookieName = process.env.COOKIE_NAME || "campusfix_token";

  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/"
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful"
  });
};

export const getCurrentUser = (req, res) => {
  return res.status(200).json({
    success: true,
    user: publicUser(req.user)
  });
};

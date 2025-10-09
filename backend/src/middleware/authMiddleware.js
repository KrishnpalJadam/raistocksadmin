import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

// ✅ Admin-only middleware
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

// ✅ Subrole-based middleware (optional for traders, investors, etc.)
export const requireSubRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.subRole)) {
      return res
        .status(403)
        .json({ message: `Access denied: Requires ${allowedRoles.join(", ")}` });
    }
    next();
  };
};

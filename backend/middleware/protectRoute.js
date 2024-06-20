const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protectRoute = async (req, res, next) => {
  try {
    // console.log('Cookies:', req.cookies);
    const token = req.cookies.jwt;

    if (!token) {
      
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Check if user exists
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    // Attach user object to the request
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute:", error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = protectRoute;

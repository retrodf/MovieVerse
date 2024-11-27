// middlewares/authMiddleware.js

const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const errorMessage =
        err.name === "TokenExpiredError"
          ? "Token has expired"
          : "Invalid token";

      return res.status(401).json({
        status: "error",
        message: errorMessage,
      });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  });
};

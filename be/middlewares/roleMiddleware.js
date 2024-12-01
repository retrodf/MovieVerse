// middlewares/roleMiddleware.js
const roleMiddleware = (roles) => {
  if (!Array.isArray(roles)) {
    throw new Error("Roles must be an array of allowed roles");
  }

  return (req, res, next) => {
    console.log("User Role:", req.userRole); // Debug role pengguna
    console.log("Allowed Roles:", roles); // Debug roles yang diperbolehkan

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Insufficient role permissions.",
      });
    }
    next();
  };
};

module.exports = roleMiddleware;

  
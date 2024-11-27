// middlewares/roleMiddleware.js
const roleMiddleware = (roles) => {
  // Validasi input untuk memastikan roles adalah array
  if (!Array.isArray(roles)) {
    throw new Error("Roles must be an array of allowed roles");
  }

  return (req, res, next) => {
    // Pastikan role pengguna ada dalam daftar role yang diizinkan
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Insufficient role permissions.",
      });
    }
    next(); // Lanjutkan ke middleware berikutnya atau route handler
  };
};

module.exports = roleMiddleware;

  
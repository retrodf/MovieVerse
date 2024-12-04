const express = require("express");
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const User = require('../models/User');

const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { verifyEmail } = userController;

// Route yang dilindungi dengan autentikasi dan role-based access control
router.get("/", authMiddleware, roleMiddleware(["admin"]), userController.getAllUsers); 
router.post("/create", authMiddleware, roleMiddleware(["admin"]), userController.createUser); 
router.get("/:id", authMiddleware, roleMiddleware(["admin", "user"]), userController.getUserById);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), userController.updateUser); 
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), userController.deleteUser); 
router.put("/:id/suspend", authMiddleware, roleMiddleware(["admin"]), userController.suspendUser);

// Route publik untuk registrasi dan login
router.post("/register", userController.register);
router.post("/login", userController.login);

// Forgot and Reset Password Routes
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword/:token", userController.resetPassword);

// Google Authentication Routes
router.get(
  "/auth/google",
  (req, res, next) => {
    console.log("Redirecting to Google OAuth");
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] }) // Periksa scope disini
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
      }

      const token = jwt.sign(
        { 
          userId: req.user.id, 
          email: req.user.email, 
          role: req.user.role,
          isVerified: req.user.isVerified
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Redirect with token
      return res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);

    } catch (error) {
      console.error('Google OAuth Callback Error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }
  }
);

// Route untuk verifikasi email
router.get("/verify/:token", verifyEmail);

module.exports = router;
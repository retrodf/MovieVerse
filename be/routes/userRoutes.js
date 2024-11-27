// routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

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

// Redirect ke Google untuk login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback setelah login sukses dari Google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id, name: req.user.name, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Redirect ke frontend dengan token di URL
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

// Route untuk verifikasi email
router.get("/verify/:token", verifyEmail);

module.exports = router;

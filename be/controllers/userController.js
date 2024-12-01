const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { Op } = require("sequelize"); // Pastikan menambahkan Op dari Sequelize untuk query

// Konfigurasi Nodemailer untuk mengirim email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user", error: err });
  }
};

// Function to update user details// Mendapatkan semua user
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ message: "Success fetch data user", data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};

// Membuat user baru
exports.createUser = async (req, res) => {
  try {
    // Tetapkan peran sebagai 'user' secara otomatis
    req.body.role = "user";
    
    const newUser = await User.create(req.body);
    res.status(201).json({ message: "User berhasil ditambahkan", data: newUser });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Error creating user", error: err });
  }
};

// Memperbarui user berdasarkan ID
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    // Hapus field role dari request body agar tidak diubah
    delete req.body.role;
  
    // logika untuk mengatur isSuspended
    if (typeof req.body.isSuspended !== 'undefined') {
      user.isSuspended = req.body.isSuspended;
    }

    // Cek apakah ada password yang dikirimkan dalam request
    if (req.body.password) {
      // Hash password baru
      req.body.password = await bcrypt.hash(req.body.password, 10);
    } else {
      // Jika tidak ada password baru, hapus field password dari req.body agar tidak di-update
      delete req.body.password;
    }

    await user.update(req.body);
    res.status(200).json({ message: "User berhasil diperbarui", data: user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Error updating user", error: err });
  }
};

// Menghapus user berdasarkan ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    // Cegah penghapusan admin utama
    const mainAdminId = 1; // Ganti dengan ID atau atribut unik admin utama
    if (user.id === mainAdminId) {
      return res.status(403).json({ message: "Admin utama tidak bisa dihapus." });
    }

    await user.destroy();
    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user", error: err });
  }
};


// Fungsi Registrasi
exports.register = async (req, res) => {
  const { name, email, password, role, username } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign(
      { userId: email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      username,
      isVerified: false,
      verificationToken,
    });

    await this.sendVerificationEmail(newUser, verificationToken, res);
    res.status(201).json({
      message: "Registrasi berhasil. Silakan cek email Anda untuk verifikasi.",
    });
  } catch (error) {
    console.error("Error registrasi:", error);
    // Mengirimkan objek error dengan pesan error
    res.status(500).json({
      message: "Gagal registrasi.",
      error: {
        message: error.message,  // Mengirim pesan error yang tepat
      },
    });
  }
};

// Fungsi untuk mengirim email verifikasi
exports.sendVerificationEmail = async (user, token, res) => {
  const verificationLink = `http://localhost:3000/api/admin/user/verify/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Verifikasi Email - MovieVerse",
    html: `<h2>Hai ${user.name}!</h2>
           <p>Terima kasih telah mendaftar. Klik link berikut untuk memverifikasi akun Anda:</p>
           <a href="${verificationLink}">Verifikasi Email</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email verifikasi terkirim");
  } catch (error) {
    console.error("Error saat mengirim email:", error);
    res.status(500).json({ message: "Gagal mengirim email verifikasi." });
  }
};

// Fungsi verifikasi email
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { email: decoded.userId } });
    if (!user) {
      return res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa." });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Email berhasil diverifikasi. Silakan login." });
  } catch (error) {
    console.error("Error saat verifikasi email:", error);
    res.status(400).json({ message: "Token tidak valid atau sudah kedaluwarsa." });
  }
};

// Fungsi login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password diperlukan" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (user.isSuspended) {
      return res.status(403).json({ message: "Akun ini ditangguhkan." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email belum diverifikasi" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login berhasil",
      token: token,
      userId: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error("Error saat login:", err);
    res.status(500).json({ message: "Gagal login" });
  }
};

// Fungsi untuk lupa password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email diperlukan." });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetPasswordExpires = new Date(Date.now() + 3600000); // Token valid selama 1 jam

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    const resetLink = `http://localhost:5173/resetPassword/${resetToken}`;
    console.log("Reset Password Link:", resetLink); // Debug reset link untuk memastikan

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Password - MovieVerse",
      html: `<p>Klik link berikut untuk mereset password Anda:</p>
             <a href="${resetLink}">Reset Password</a>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email reset password terkirim ke:", user.email);

    res.status(200).json({ message: "Link reset password telah dikirim ke email Anda." });
  } catch (error) {
    console.error("Error saat lupa password:", error);
    res.status(500).json({ message: "Gagal mengirim email reset password.", error });
  }
};

// Fungsi untuk reset password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({
      message: "Password harus memiliki minimal 6 karakter.",
    });
  }

  try {
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("Token diterima:", token); // Debug token asli
    console.log("Hashed Token untuk validasi:", resetPasswordToken); // Debug hashed token

    const user = await User.findOne({
      where: {
        resetPasswordToken,
        resetPasswordExpires: { [Op.gt]: new Date() }, // Token belum kadaluarsa
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token tidak valid atau sudah kadaluarsa.",
        errorDetail: "Token tidak ditemukan di database atau sudah kedaluwarsa.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password sebelum hashing:", password); // Debug
    console.log("Password setelah hashing:", hashedPassword); // Debug

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password berhasil direset." });
  } catch (error) {
    console.error("Error saat reset password:", error);
    res.status(500).json({ message: "Gagal mereset password.", error });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Cek jika user adalah admin utama berdasarkan id atau email
    const mainAdminId = 1; // Ganti dengan ID atau atribut unik admin utama
    if (user.id === mainAdminId) {
      return res.status(403).json({ message: "Admin utama tidak bisa di-suspend." });
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.status(200).json({
      message: `Pengguna ${user.isSuspended ? "disuspend" : "diaktifkan kembali"} dengan sukses.`,
      data: user,
    });
  } catch (error) {
    console.error("Error suspending user:", error);
    res.status(500).json({ message: "Gagal mengubah status suspend user" });
  }
};


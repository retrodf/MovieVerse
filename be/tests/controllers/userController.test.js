const {
    login,
    createUser,
    verifyEmail,
    forgotPassword,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    register,
    resetPassword,
    suspendUser,
  } = require("../../controllers/userController");
  const User = require("../../models/User");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const nodemailer = require("nodemailer");
  
  // Mock Sequelize model and external libraries
  jest.mock("../../models/User");
  jest.mock("bcrypt");
  jest.mock("jsonwebtoken");
  jest.mock("nodemailer", () => ({
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockResolvedValue(true),
    }),
  }));
  
  describe("User Controller", () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        body: {},
        params: {},
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });
  
    afterEach(() => {
      jest.resetAllMocks(); // Reset semua mock setelah setiap pengujian
    });
  
    afterAll(async () => {
      const sequelize = require("../../library/database");
      await sequelize.close(); // Tutup koneksi database setelah semua pengujian selesai
      jest.clearAllMocks(); // Bersihkan semua mock
    });
  
    // Pengujian Login (Sudah ada)
    describe('Login', () => {
      it('should return token and user details on successful login', async () => {
        User.findOne.mockResolvedValue({
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          isVerified: true,
          isSuspended: false,
          username: 'testUser',
          role: 'user',
        });
        bcrypt.compare.mockResolvedValue(true); // Mock password cocok
        jwt.sign.mockReturnValue('testToken'); // Mock JWT token
  
        req.body = { email: 'test@example.com', password: 'password123' };
  
        await login(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Login berhasil',
          token: 'testToken',
          userId: 1,
          username: 'testUser',
          role: 'user',
        });
      });
  
      it('should return 404 if email is not found', async () => {
        User.findOne.mockResolvedValue(null); // Mock user tidak ditemukan
  
        req.body = { email: 'test@example.com', password: 'password123' };
  
        await login(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User tidak ditemukan' });
      });
  
      it('should return 401 if password is incorrect', async () => {
        User.findOne.mockResolvedValue({
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          isVerified: true,
          isSuspended: false,
          username: 'testUser',
          role: 'user',
        });
        bcrypt.compare.mockResolvedValue(false); // Mock password salah
  
        req.body = { email: 'test@example.com', password: 'wrongPassword' };
  
        await login(req, res);
  
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password salah' });
      });
  
      it('should return 403 if email is not verified', async () => {
        User.findOne.mockResolvedValue({
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          isVerified: false, // Email belum diverifikasi
          isSuspended: false,
          username: 'testUser',
          role: 'user',
        });
  
        req.body = { email: 'test@example.com', password: 'password123' };
  
        await login(req, res);
  
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Email belum diverifikasi' });
      });
  
      it('should return 403 if account is suspended', async () => {
        User.findOne.mockResolvedValue({
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          isVerified: true,
          isSuspended: true, // Akun ditangguhkan
          username: 'testUser',
          role: 'user',
        });
  
        req.body = { email: 'test@example.com', password: 'password123' };
  
        await login(req, res);
  
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Akun ini ditangguhkan.' });
      });
    });
  
    // Tambahan: Pengujian Get User by ID
    describe('getUserById', () => {
        it('should return user data successfully', async () => {
        const mockUser = { id: 1, name: 'Test User' };
        User.findByPk.mockResolvedValue(mockUser);

        req.params.id = 1;

        await getUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return 404 if user not found', async () => {
        User.findByPk.mockResolvedValue(null);

        req.params.id = 1;

        await getUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User tidak ditemukan' });
        });
    });
  
    // Tambahan: Pengujian Get All Users
    describe('getAllUsers', () => {
      it('should return all users successfully', async () => {
        const mockUsers = [{ id: 1, name: 'Test User' }];
        User.findAll.mockResolvedValue(mockUsers);
  
        await getAllUsers(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Success fetch data user',
          data: mockUsers,
        });
      });
  
      it('should handle errors when fetching users', async () => {
        User.findAll.mockRejectedValue(new Error('Database error'));
  
        await getAllUsers(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Error fetching users',
          error: expect.any(Object),
        });
      });
    });
  
    // Pengujian Update User
    describe('updateUser', () => {
        it('should update user details successfully', async () => {
        const mockUser = { id: 1, name: 'Old Name', update: jest.fn() };
        User.findByPk.mockResolvedValue(mockUser);

        req.params.id = 1;
        req.body = { name: 'New Name' };

        await updateUser(req, res);

        expect(mockUser.update).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'User berhasil diperbarui',
            data: mockUser,
        });
        });

        it('should return 404 if user not found', async () => {
        User.findByPk.mockResolvedValue(null);

        req.params.id = 1;

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User tidak ditemukan' });
        });
    });
  
    // Tambahan: Pengujian Register
    describe('register', () => {
      it('should register user successfully', async () => {
        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashedPassword');
        User.create.mockResolvedValue({ id: 1 });
  
        req.body = {
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser',
        };
  
        await register(req, res);
  
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Registrasi berhasil. Silakan cek email Anda untuk verifikasi.',
        });
      });
  
      it('should return 400 if email already registered', async () => {
        User.findOne.mockResolvedValue({ id: 1 });
  
        req.body = { email: 'test@example.com' };
  
        await register(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Email sudah terdaftar.' });
      });
    });
  
    // Tambahan: Pengujian Reset Password
    describe('resetPassword', () => {
      it('should reset password successfully', async () => {
        const mockUser = {
          id: 1,
          resetPasswordToken: 'hashedToken',
          resetPasswordExpires: new Date(Date.now() + 3600000),
          save: jest.fn(),
        };
  
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.hash.mockResolvedValue('newHashedPassword');
  
        req.params.token = 'validToken';
        req.body.password = 'newPassword';
  
        await resetPassword(req, res);
  
        expect(mockUser.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password berhasil direset.' });
      });
  
      it('should return 400 if token is invalid or expired', async () => {
        User.findOne.mockResolvedValue(null);
  
        req.params.token = 'invalidToken';
        req.body.password = 'newPassword';
  
        await resetPassword(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token tidak valid atau sudah kadaluarsa.' });
      });
    });

    describe('Create User', () => {
        it('should handle error when creating a user', async () => {
          User.create.mockRejectedValue(new Error('Database error')); // Mock error database
    
          req.body = { name: 'Test User', email: 'test@example.com', password: 'password123' };
          await createUser(req, res);
    
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({ message: 'Error creating user', error: expect.any(Object) });
        });
      });
    
      describe('Verify Email', () => {
        it('should return 400 if verification token is invalid', async () => {
          jwt.verify.mockImplementation(() => {
            throw new Error('Invalid token');
          }); // Mock token invalid
          req.params = { token: 'invalidToken' };
    
          await verifyEmail(req, res);
    
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
        });
      });
    
      describe('Forgot Password', () => {
        it('should return 404 if email is not found during forgotPassword', async () => {
          User.findOne.mockResolvedValue(null); // Mock email tidak ditemukan
    
          req.body = { email: 'nonexistent@example.com' };
          await forgotPassword(req, res);
    
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith({ message: 'Email tidak ditemukan.' });
        });
      });

});
  
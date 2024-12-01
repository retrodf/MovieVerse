// File: tests/controllers/login.test.js
const { login } = require("../../controllers/userController");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Remove the Sequelize mock that's causing issues
jest.mock("../../models/User", () => ({
  findOne: jest.fn(),
}));

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("User Controller - Login", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return token and user details on successful login', async () => {
    // Mocking the resolved user
    User.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      isVerified: true,
      isSuspended: false,
      username: 'testUser',
      role: 'user',
    });

    // Mock bcrypt to simulate correct password match
    bcrypt.compare.mockResolvedValue(true);

    // Mock JWT signing
    jwt.sign.mockReturnValue('testToken');

    // Mock the request body
    req.body = { email: 'test@example.com', password: 'password123' };

    // Call the function under test
    await login(req, res);

    // Check if the response status is correct
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
    // Mock User.findOne to return null (email not found)
    User.findOne.mockResolvedValue(null);

    req.body = { email: 'test@example.com', password: 'password123' };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User tidak ditemukan' });
  });

  it('should return 401 if password is incorrect', async () => {
    // Mock User.findOne to return user data
    User.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      isVerified: true,
      isSuspended: false,
      username: 'testUser',
      role: 'user',
    });

    // Mock bcrypt to simulate incorrect password
    bcrypt.compare.mockResolvedValue(false);

    req.body = { email: 'test@example.com', password: 'wrongPassword' };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Password salah' });
  });

  it('should return 403 if email is not verified', async () => {
    // Mock User.findOne to return a user with isVerified = false
    User.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      isVerified: false,
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
    // Mock User.findOne to return a suspended user
    User.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      isVerified: true,
      isSuspended: true, // Account is suspended
      username: 'testUser',
      role: 'user',
    });

    req.body = { email: 'test@example.com', password: 'password123' };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Akun ini ditangguhkan.' });
  });
});

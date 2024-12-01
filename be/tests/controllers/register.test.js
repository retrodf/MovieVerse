// File: tests/controllers/register.test.js
const { register, sendVerificationEmail } = require("../../controllers/userController");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

// Mock semua modul eksternal
jest.mock("../../models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true) // Mock untuk menghindari pengiriman email nyata
  })
}));

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe('register', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks sebelum setiap test
    jest.clearAllMocks();

    // Setup default request dan response
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        role: 'user',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should register user successfully', async () => {
    // Mock proses registrasi
    User.findOne.mockResolvedValue(null);  // Pastikan email belum ada di database
    bcrypt.hash.mockResolvedValue('hashedPassword');  // Mock hashing password
    User.create.mockResolvedValue({ id: 1, email: 'test@example.com' });  // Simulasikan pembuatan user baru

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Registrasi berhasil. Silakan cek email Anda untuk verifikasi.',
    });
  });

  it('should return 400 if email already registered', async () => {
    User.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' });  // Simulasikan email sudah terdaftar

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email sudah terdaftar.' });
  });

  it('should return 500 if error occurs during user creation', async () => {
    // Mock untuk mensimulasikan error database
    User.findOne.mockResolvedValue(null);  // Pastikan email belum ada
    bcrypt.hash.mockResolvedValue('hashedPassword');  // Mock hashing password
    User.create.mockRejectedValue(new Error('Database error'));  // Simulasikan error saat membuat user

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    // Pastikan bahwa error dikirim dalam format yang benar
    expect(res.json).toHaveBeenCalledWith({
      message: 'Gagal registrasi.',
      error: expect.objectContaining({
        message: 'Database error',  // Pesan error harus sama dengan yang disimulasikan
      }),
    });
  });
});

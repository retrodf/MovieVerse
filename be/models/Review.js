// models/Review.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../library/database");

class Review extends Model {}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Approved", "Unapproved"),
      defaultValue: "Unapproved",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "moviereview",
    timestamps: true, // Aktifkan timestamps untuk mendapatkan createdAt secara otomatis
    createdAt: 'createdAt', // Nama kolom untuk createdAt
    updatedAt: false, // Nonaktifkan jika Anda tidak membutuhkan updatedAt
  }
);

module.exports = Review;

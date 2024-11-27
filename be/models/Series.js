const { DataTypes } = require("sequelize");
const sequelize = require("../library/database"); // Pastikan ini adalah path yang benar ke koneksi database Anda

const Series = sequelize.define(
  "Series",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    directorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    approval_status: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
    },
    countryId: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    release_date: {
      type: DataTypes.DATEONLY, // timestamp in MySQL can be mapped to DATE in Sequelize
      allowNull: false,
    },
    synopsis: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    seasons: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    episodes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    poster_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    trailer_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_popular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "series",
    timestamps: false, // Disable Sequelize from adding `createdAt` and `updatedAt` fields
    charset: "utf8mb4",
    collate: "utf8mb4_0900_ai_ci",
  }
);

module.exports = Series;

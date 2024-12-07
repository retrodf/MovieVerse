require("dotenv").config();
const { Sequelize } = require("sequelize");
import mysql2 from "mysql2";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectModule: "mysql12",
    port: process.env.DB_PORT || 3306,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Unable to connect to the database:", err));

module.exports = sequelize;

// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../library/database');

// class User extends Model {}

// User.init({
//   // definisi atribut model
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   // tambahkan atribut lainnya
// }, {
//   sequelize, // pass the connection instance
//   modelName: 'User', // choose the model name
//   // tambahkan opsi lain jika diperlukan
// });

// module.exports = User;

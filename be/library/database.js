require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
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

const connectWithRetry = async () => {
  let retries = 10;
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log("Database connected successfully");
      break;
    } catch (err) {
      console.error("Unable to connect to the database:", err.message);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

connectWithRetry();

module.exports = sequelize;

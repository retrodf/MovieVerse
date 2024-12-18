// models/Movie.js
const { Model, DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../library/database");
const Director = require("./Director");
const Country = require("./Country");

class Movie extends Model {}

Movie.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },    
    directorId: {
      type: DataTypes.INTEGER,
      references: {
        model: Director,
        key: "id",
      },
      allowNull: false,
    },
    approval_status: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    countryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Country,
        key: "countryId",
      },
      allowNull: false,
    },
    release_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
    },
    synopsis: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    poster_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // trailer_url: {
    //   type: DataTypes.TEXT,
    //   allowNull: false,
    // },
    is_popular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,  
    modelName: "Movie",
    tableName: "movie",
    timestamps: false,
  }
);

module.exports = Movie;

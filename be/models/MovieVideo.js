const { Model, DataTypes } = require("sequelize");
const sequelize = require("../library/database");
const Movie = require("./Movie");

class MovieVideo extends Model {}

MovieVideo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },    
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Movie,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "MovieVideo",
    tableName: "movie_videos",
    timestamps: false,
  }
);

module.exports = MovieVideo;

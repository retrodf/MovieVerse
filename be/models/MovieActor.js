const { Model, DataTypes } = require("sequelize");
const sequelize = require("../library/database"); // Adjust path as needed
const Movie = require("./Movie");
const Actor = require("./Actor");

class MovieActor extends Model {}

MovieActor.init(
  {
    // id: {
    //   type: DataTypes.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: true,
    // },
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
    actorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Actor,
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "MovieActor",
    tableName: "movie_actors",
    timestamps: false,
  }
);


module.exports = MovieActor;

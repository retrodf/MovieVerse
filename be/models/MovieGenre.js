const { Model, DataTypes } = require('sequelize');
const sequelize = require('../library/database');
const Movie = require("./Movie");
const Genre = require("./Genre");

class MovieGenre extends Model {}

MovieGenre.init(
  {
    movieId: {
      type: DataTypes.INTEGER,
      references: {
        model: Movie,  // Menghubungkan dengan model Movie
        key: 'id',
      },
      allowNull: false,
    },
    genreId: {
      type: DataTypes.INTEGER,
      references: {
        model: Genre,  // Menghubungkan dengan model Genre
        key: 'id',
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'MovieGenre',
    tableName: 'movie_genre', // Nama tabel penghubung di database
    timestamps: false,  // Menghilangkan kolom timestamps (createdAt, updatedAt)
  }
);

module.exports = MovieGenre;

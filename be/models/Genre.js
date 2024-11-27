const { Model, DataTypes } = require('sequelize');
const sequelize = require('../library/database');

class Genre extends Model {}

Genre.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Genre',
    tableName: 'genre',
    timestamps: false,
  }
);

module.exports = Genre;

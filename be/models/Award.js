// models/Award.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../library/database');
const Country = require('./Country'); // Import model Country

class Award extends Model {}

Award.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    countryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Country,
            key: 'countryId',
        },
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Award',
    tableName: 'award',
    timestamps: false,
});

// Definisikan relasi
Award.belongsTo(Country, { foreignKey: 'countryId', as: 'country' });
Country.hasMany(Award, { foreignKey: 'countryId' });

module.exports = Award;

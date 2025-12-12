const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME || 'postgres',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '1',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT || 'postgres',
        port: process.env.DB_PORT || 5432,
        logging: false
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Equipment = require('./Equipment')(sequelize, DataTypes);
db.Client = require('./Client')(sequelize, DataTypes);
db.Rental = require('./Rental')(sequelize, DataTypes);

// Define associations
// Client has many Rentals
db.Client.hasMany(db.Rental, { foreignKey: 'client_id', as: 'rentals' });
db.Rental.belongsTo(db.Client, { foreignKey: 'client_id', as: 'client' });

// Equipment has many Rentals
db.Equipment.hasMany(db.Rental, { foreignKey: 'equipment_id', as: 'rentals' });
db.Rental.belongsTo(db.Equipment, { foreignKey: 'equipment_id', as: 'equipment' });

module.exports = db;

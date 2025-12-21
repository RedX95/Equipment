const { Sequelize, DataTypes } = require('sequelize');

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

/* MODELS (ЛР-7)*/

// Категория оборудования (E1)
db.Category = require('./category.model')(sequelize, DataTypes);

// Оборудование (E2)
db.Equipment = require('./equipment.model')(sequelize, DataTypes);

// Клиент (E3)
db.Client = require('./client.model')(sequelize, DataTypes);

// Ценовая категория (E8)
db.PriceCategory = require('./price-category.model')(sequelize, DataTypes);

// Заказ (E4)
db.Order = require('./order.model')(sequelize, DataTypes);

// Платеж (E5)
db.Payment = require('./payment.model')(sequelize, DataTypes);

// Оборудование в заказе (E7)
db.OrderEquipment = require('./order-equipment.model')(sequelize, DataTypes);

/* =======================
   ASSOCIATIONS
======================= */

// Категория → Оборудование
db.Category.hasMany(db.Equipment, { foreignKey: 'category_id' });
db.Equipment.belongsTo(db.Category, { foreignKey: 'category_id' });

// Клиент → Заказ
db.Client.hasMany(db.Order, { foreignKey: 'client_id' });
db.Order.belongsTo(db.Client, { foreignKey: 'client_id' });

// Ценовая категория → Заказ
db.PriceCategory.hasMany(db.Order, { foreignKey: 'price_category_id' });
db.Order.belongsTo(db.PriceCategory, { foreignKey: 'price_category_id' });

// Заказ → Платеж
db.Order.hasMany(db.Payment, { foreignKey: 'order_id' });
db.Payment.belongsTo(db.Order, { foreignKey: 'order_id' });

// Заказ ↔ Оборудование (many-to-many)
db.Order.belongsToMany(db.Equipment, {
    through: db.OrderEquipment,
    foreignKey: 'order_id',
    otherKey: 'equipment_id'
});

db.Equipment.belongsToMany(db.Order, {
    through: db.OrderEquipment,
    foreignKey: 'equipment_id',
    otherKey: 'order_id'
});

module.exports = db;

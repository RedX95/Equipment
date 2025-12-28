const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// =====================
// МОДЕЛИ
// =====================
db.Category = require("./category.model")(sequelize, DataTypes);
db.Equipment = require("./equipment.model")(sequelize, DataTypes);
db.Client = require("./client.model")(sequelize, DataTypes);
db.Order = require("./order.model")(sequelize, DataTypes);
db.OrderEquipment = require("./order-equipment.model")(sequelize, DataTypes);
db.Payment = require("./payment.model")(sequelize, DataTypes);
db.PriceCategory = require("./price-category.model")(sequelize, DataTypes);

// =====================
// СВЯЗИ (ЛР-10)
// =====================

// Категория → Категория (иерархия)
db.Category.hasMany(db.Category, {
  foreignKey: "baseCategoryId",
  as: "subcategories"
});
db.Category.belongsTo(db.Category, {
  foreignKey: "baseCategoryId",
  as: "parentCategory"
});

// Категория → Оборудование (1:M)
db.Category.hasMany(db.Equipment, {
  foreignKey: "categoryId",
  as: "equipment"
});
db.Equipment.belongsTo(db.Category, {
  foreignKey: "categoryId",
  as: "category"
});

// Клиент → Заказ (1:M)
db.Client.hasMany(db.Order, {
  foreignKey: "clientId",
  as: "orders"
});
db.Order.belongsTo(db.Client, {
  foreignKey: "clientId",
  as: "client"
});

// Ценовая категория → Заказ (1:M)
db.PriceCategory.hasMany(db.Order, {
  foreignKey: "priceCategoryId",
  as: "orders"
});
db.Order.belongsTo(db.PriceCategory, {
  foreignKey: "priceCategoryId",
  as: "priceCategory"
});

// Заказ ↔ Оборудование (M:M)
db.Order.belongsToMany(db.Equipment, {
  through: db.OrderEquipment,
  foreignKey: "orderId",
  otherKey: "equipmentId",
  as: "equipment"
});

db.Equipment.belongsToMany(db.Order, {
  through: db.OrderEquipment,
  foreignKey: "equipmentId",
  otherKey: "orderId",
  as: "orders"
});

// Заказ → Платёж (1:M)
db.Order.hasMany(db.Payment, {
  foreignKey: "orderId",
  as: "payments"
});
db.Payment.belongsTo(db.Order, {
  foreignKey: "orderId",
  as: "order"
});

module.exports = db;

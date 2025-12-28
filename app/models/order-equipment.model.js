module.exports = (sequelize, Sequelize) => {
  const OrderEquipment = sequelize.define("order_equipment", {
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    rentPrice: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  });

  return OrderEquipment;
};

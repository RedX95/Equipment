module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("order", {
    dateStart: {
      type: Sequelize.DATE,
      allowNull: false
    },
    dateEnd: {
      type: Sequelize.DATE,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING(30),
      allowNull: false
    }
  });

  return Order;
};

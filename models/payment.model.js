module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define("payment", {
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    paymentDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    paymentType: {
      type: Sequelize.STRING(30),
      allowNull: false
    }
  });

  return Payment;
};

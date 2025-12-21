module.exports = (sequelize, Sequelize) => {
  const PriceCategory = sequelize.define("price_category", {
    dateStart: {
      type: Sequelize.DATE,
      allowNull: false
    },
    dateEnd: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });

  return PriceCategory;
};

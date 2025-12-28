module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("category", {
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    },
    baseCategoryId: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  });

  return Category;
};

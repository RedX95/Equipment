module.exports = (sequelize, Sequelize) => {
  const Equipment = sequelize.define("equipment", {
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    inventoryNumber: {
      type: Sequelize.STRING(40),
      allowNull: false,
      unique: true
    }
  });

  return Equipment;
};

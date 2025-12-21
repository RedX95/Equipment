module.exports = (sequelize, Sequelize) => {
  const Client = sequelize.define("client", {
    fullName: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING(40),
      allowNull: false,
      unique: true
    }
  });

  return Client;
};


module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define('Client', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING
        },
        company_name: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'clients',
        timestamps: true
    });

    return Client;
};

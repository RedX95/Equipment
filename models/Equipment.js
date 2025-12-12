module.exports = (sequelize, DataTypes) => {
    const Equipment = sequelize.define('Equipment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        price_per_day: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('available', 'rented', 'maintenance'),
            defaultValue: 'available'
        },
        image_url: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'equipment',
        timestamps: true
    });

    return Equipment;
};

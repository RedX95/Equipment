module.exports = (sequelize, DataTypes) => {
    const Rental = sequelize.define('Rental', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        total_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'completed', 'cancelled'),
            defaultValue: 'active'
        }
    }, {
        tableName: 'rentals',
        timestamps: true
    });

    return Rental;
};

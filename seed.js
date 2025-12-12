const { sequelize, Equipment, Client, Rental } = require('./models');

const equipmentData = [
    {
        name: 'Экскаватор JCB 3CX',
        description: 'Универсальный экскаватор-погрузчик для земляных работ.',
        price_per_day: 15000,
        status: 'available'
    },
    {
        name: 'Бульдозер CAT D6',
        description: 'Мощный бульдозер для перемещения грунта.',
        price_per_day: 25000,
        status: 'available'
    },
    {
        name: 'Автокран Liebherr LTM',
        description: 'Мобильный кран грузоподъемностью 50 тонн.',
        price_per_day: 40000,
        status: 'available'
    },
    {
        name: 'Бетономешалка MAN',
        description: 'Автобетоносмеситель объемом 9 кубов.',
        price_per_day: 12000,
        status: 'maintenance'
    },
    {
        name: 'Виброкаток Bomag',
        description: 'Дорожный каток для уплотнения асфальта.',
        price_per_day: 10000,
        status: 'available'
    }
];

const clientData = [
    { name: 'Иван Иванов', email: 'ivan@example.com', phone: '+79001234567', company_name: 'СтройГрупп' },
    { name: 'Петр Петров', email: 'petr@example.com', phone: '+79007654321', company_name: 'Частный заказчик' }
];

async function seed() {
    try {
        await sequelize.sync({ force: true }); // Recreate tables

        const equipment = await Equipment.bulkCreate(equipmentData);
        const clients = await Client.bulkCreate(clientData);

        // Create some rentals
        await Rental.create({
            client_id: clients[0].id,
            equipment_id: equipment[0].id, // JCB
            start_date: new Date(),
            end_date: new Date(new Date().setDate(new Date().getDate() + 5)),
            total_price: 75000,
            status: 'active'
        });

        await Rental.create({
            client_id: clients[1].id,
            equipment_id: equipment[2].id, // Liebherr
            start_date: new Date(new Date().setDate(new Date().getDate() - 10)),
            end_date: new Date(new Date().setDate(new Date().getDate() - 5)),
            total_price: 200000,
            status: 'completed'
        });

        console.log('✅ База данных успешно заполнена тестовыми данными!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Ошибка при заполнении базы данных:', err);
        process.exit(1);
    }
}

seed();

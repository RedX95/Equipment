require("dotenv").config();
const db = require("../app/models");
const initData = require("./init-data.json");

async function initDatabase() {
  try {
    console.log("🔄 Синхронизация базы данных...");
    await db.sequelize.sync({ force: true });
    console.log("✅ База данных синхронизирована");

    // Создание категорий
    console.log("📦 Создание категорий...");
    const categories = await db.Category.bulkCreate(initData.categories);
    console.log(`✅ Создано ${categories.length} категорий`);

    // Создание оборудования
    console.log("🔧 Создание оборудования...");
    const equipment = await db.Equipment.bulkCreate(initData.equipment);
    console.log(`✅ Создано ${equipment.length} единиц оборудования`);

    // Создание клиентов
    console.log("👥 Создание клиентов...");
    const clients = await db.Client.bulkCreate(initData.clients);
    console.log(`✅ Создано ${clients.length} клиентов`);

    // Создание ценовых категорий
    console.log("💰 Создание ценовых категорий...");
    const priceCategories = await db.PriceCategory.bulkCreate(initData.priceCategories);
    console.log(`✅ Создано ${priceCategories.length} ценовых категорий`);

    // Создание заказов
    console.log("📋 Создание заказов...");
    const orders = await db.Order.bulkCreate(initData.orders);
    console.log(`✅ Создано ${orders.length} заказов`);

    // Создание связей заказ-оборудование
    console.log("🔗 Создание связей заказ-оборудование...");
    const orderEquipment = await db.OrderEquipment.bulkCreate(initData.orderEquipment);
    console.log(`✅ Создано ${orderEquipment.length} связей`);

    // Создание платежей
    console.log("💳 Создание платежей...");
    const payments = await db.Payment.bulkCreate(initData.payments);
    console.log(`✅ Создано ${payments.length} платежей`);

    console.log("\n🎉 База данных успешно инициализирована!");
    console.log("\nДанные для тестирования:");
    console.log("- Категории: 4");
    console.log("- Оборудование: 5");
    console.log("- Клиенты: 3");
    console.log("- Заказы: 3");
    console.log("- Платежи: 3");

    process.exit(0);
  } catch (error) {
    console.error("❌ Ошибка инициализации базы данных:", error);
    process.exit(1);
  }
}

initDatabase();


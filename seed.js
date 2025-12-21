const db = require("./app/models");

async function seed() {
  await db.sequelize.sync({ force: true });

  const category = await db.Category.create({
    name: "Строительное оборудование"
  });

  const equipment = await db.Equipment.create({
    name: "Перфоратор",
    inventoryNumber: "INV-001",
    category_id: category.id
  });

  const client = await db.Client.create({
    fullName: "Иванов Иван",
    phone: "+79990000000"
  });

  console.log("DB seeded");
  process.exit();
}

seed();

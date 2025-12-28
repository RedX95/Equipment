require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Инициализация приложения
const app = express();
const PORT = process.env.NODE_DOCKER_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Sequelize
const db = require("./app/models");



// =======================
// API ROUTES
// =======================

// Проверка сервера
app.get("/api/test", (req, res) => {
  res.json({ message: "ConstructionRental API works" });
});

// Получить все категории
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await db.Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить всё оборудование
app.get("/api/equipment", async (req, res) => {
  try {
    const equipment = await db.Equipment.findAll({
      include: db.Category
    });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить клиентов
app.get("/api/clients", async (req, res) => {
  try {
    const clients = await db.Client.findAll();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Получить заказы
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await db.Order.findAll({
      include: [
        db.Client,
        db.PriceCategory,
        {
          model: db.Equipment,
          through: { attributes: ["quantity", "rentPrice"] }
        }
      ]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// FRONTEND ROUTES
// =======================

// Главная страница
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Админ-панель
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// =======================
// START SERVER
// =======================

db.sequelize
  .sync()
  .then(() => {
    console.log("✅ Database synced");
    require("./app/routes/category.routes")(app);
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`📱 Откройте http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Ошибка подключения к БД:", err);
  });

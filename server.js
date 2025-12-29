require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Инициализация приложения
const app = express();
const PORT = process.env.NODE_DOCKER_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Sequelize
const db = require("./app/models");

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Construction Rental API",
      version: "1.0.0",
      description: "API для управления арендой строительного оборудования",
      contact: {
        name: "API Support"
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server"
      }
    ]
  },
  apis: ["./app/routes/*.routes.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =======================
// API ROUTES
// =======================

// Проверка сервера
app.get("/api/test", (req, res) => {
  res.json({ message: "ConstructionRental API works" });
});

// Подключение всех маршрутов
require("./app/routes/category.routes")(app);
require("./app/routes/equipment.routes")(app);
require("./app/routes/client.routes")(app);
require("./app/routes/order.routes")(app);
require("./app/routes/payment.routes")(app);
require("./app/routes/price-category.routes")(app);
require("./app/routes/order-equipment.routes")(app);

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
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`📱 Откройте http://localhost:${PORT}`);
      console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("❌ Ошибка подключения к БД:", err);
  });

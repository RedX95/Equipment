# Construction Rental API

API для управления арендой строительного оборудования с полной MVC архитектурой, CRUD операциями, нестандартными SQL запросами и Swagger документацией.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` в корне проекта со следующим содержимым:
```env
# PostgreSQL Database Configuration
POSTGRESDB_USER=postgres
POSTGRESDB_ROOT_PASSWORD=postgres
POSTGRESDB_DATABASE=construction_rental
POSTGRESDB_LOCAL_PORT=5432
POSTGRESDB_DOCKER_PORT=5432

# Node.js Application Configuration
NODE_LOCAL_PORT=3000
NODE_DOCKER_PORT=3000

# Sequelize Database Connection
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=construction_rental
DB_PORT=5432
```

3. Убедитесь, что PostgreSQL запущен и доступен.

## Инициализация базы данных

Запустите скрипт инициализации для создания таблиц и заполнения тестовыми данными:

```bash
npm run init-db
```

## Запуск приложения

```bash
npm start
```

Или в режиме разработки с автоматической перезагрузкой:

```bash
npm run dev
```

## API Документация

После запуска сервера Swagger UI доступен по адресу:
- http://localhost:3000/api-docs

## Основные эндпоинты

### Categories
- `GET /api/categories` - Получить все категории
- `GET /api/categories/stats` - Статистика по категориям
- `GET /api/categories/popular` - Самые популярные категории

### Equipment
- `GET /api/equipment` - Получить все оборудование
- `GET /api/equipment/available` - Доступное оборудование
- `GET /api/equipment/:id/rental-history` - История аренды

### Clients
- `GET /api/clients` - Получить всех клиентов
- `GET /api/clients/top` - Топ клиентов
- `GET /api/clients/:id/debt` - Задолженность клиента

### Orders
- `GET /api/orders` - Получить все заказы
- `GET /api/orders/active` - Активные заказы
- `GET /api/orders/:id/total` - Расчет суммы заказа

### Payments
- `GET /api/payments` - Получить все платежи
- `GET /api/payments/stats/monthly` - Статистика по месяцам
- `GET /api/payments/unpaid-orders` - Неоплаченные заказы

Полный список команд для тестирования API доступен в файле `API_TEST_COMMANDS.md`.

## Структура проекта

```
ConstructionRental/
├── app/
│   ├── controllers/     # CRUD контроллеры + нестандартные методы
│   ├── models/          # Sequelize модели
│   └── routes/          # Маршруты с Swagger документацией
├── scripts/
│   ├── init-db.js       # Скрипт инициализации БД
│   └── init-data.json   # Тестовые данные
├── public/              # Статические файлы
└── server.js            # Главный файл приложения
```

## Технологии

- Node.js + Express
- PostgreSQL + Sequelize
- Swagger/OpenAPI 3.0
- Docker (опционально)

